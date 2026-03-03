import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Record = (props) => (
  <tr className="data-[state=selected]:bg-muted hover:bg-muted/50 border-b transition-colors">
    <td className="table-cell">
      {props.record.name}
    </td>
    <td className="table-cell">
      {props.record.position}
    </td>
    <td className="table-cell">
      {props.record.level}
    </td>
    <td className="table-cell">
      <div className="flex gap-2">
        <Link
          className="btn btn-secondary"
          to={`/edit/${props.record._id}`}
        >
          EDIT
        </Link>
        <button
          className="btn btn-danger"
          color="red"
          type="button"
          onClick={() => {
            props.deleteRecord(props.record._id);
          }}
        >
          DELETE
        </button>
      </div>
    </td>
  </tr>
);

export default function RecordList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const { token, isAuthenticated } = useAuth();

  // Sorting function
  const sortedRecords = useMemo(() => {
    let sortableRecords = [...records];
    if (sortConfig.key !== null) {
      sortableRecords.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableRecords;
  }, [records, sortConfig]);

  // Handle sort request
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // This method fetches the records from the database.
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    async function getRecords() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/record`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          setError(message);
          console.error(message);
          return;
        }
        const records = await response.json();
        setRecords(records);
      } catch (error) {
        setError('Failed to fetch records');
        console.error('Error fetching records:', error);
      } finally {
        setLoading(false);
      }
    }
    getRecords();
  }, [token, isAuthenticated]); // Added dependencies

  // Redirect if not authenticated
  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }

  // This method will delete a record
  async function deleteRecord(id) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/record/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      // Only update the UI if the delete was successful
      const newRecords = records.filter((el) => el._id !== id);
      setRecords(newRecords);
    } catch (error) {
      console.error('Error deleting record:', error);
      // You might want to show an error message to the user here
    }
  }

  // This method will map out the records on the table
  function recordList() {
    return sortedRecords.map((record) => {
      return (
        <Record
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
        />
      );
    });
  }

  // This following section will display the table with the records of individuals.
  return (
    <>
      <h3 className="p-4 font-semibold text-display text-lg">Employee Records</h3>
      {loading ? (
        <div className="p-4 text-body text-center">Loading ...</div>
      ) : error ? (
        <div className="p-4 text-body text-red-500 text-center">Error: {error}</div>
      ) : (
        <div className="table-container">
          <div className="relative w-full overflow-auto">
            <table className="table">
              <thead className="table-header">
                <tr className="table-row">
                  <th 
                    className="table-header-cell-sortable"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      {sortConfig.key === 'name' && (
                        <span className="text-xs">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="table-header-cell-sortable"
                    onClick={() => requestSort('position')}
                  >
                    <div className="flex items-center gap-1">
                      Position
                      {sortConfig.key === 'position' && (
                        <span className="text-xs">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="table-header-cell-sortable"
                    onClick={() => requestSort('level')}
                  >
                    <div className="flex items-center gap-1">
                      Level
                      {sortConfig.key === 'level' && (
                        <span className="text-xs">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="table-header-cell">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="table-body">
                {recordList()}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}