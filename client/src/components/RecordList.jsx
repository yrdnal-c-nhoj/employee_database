import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Record = (props) => (
  <tr className="data-[state=selected]:bg-muted hover:bg-muted/50 border-b transition-colors">
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.name}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.position}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.level}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        <Link
          className="inline-flex justify-center items-center bg-background hover:bg-slate-100 disabled:opacity-50 px-3 border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background focus-visible:ring-offset-2 h-9 font-medium text-sm whitespace-nowrap transition-colors disabled:pointer-events-none"
          to={`/edit/${props.record._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex justify-center items-center bg-background hover:bg-slate-100 disabled:opacity-50 px-3 border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background focus-visible:ring-offset-2 h-9 font-medium text-sm whitespace-nowrap transition-colors hover:text-accent-foreground disabled:pointer-events-none"
          color="red"
          type="button"
          onClick={() => {
            props.deleteRecord(props.record._id);
          }}
        >
          Delete
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
      <h3 className="p-4 font-semibold text-lg">Employee Records</h3>
      {loading ? (
        <div className="p-4 text-center">Loading ...</div>
      ) : error ? (
        <div className="p-4 text-red-500 text-center">Error: {error}</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm caption-bottom">
              <thead className="[&amp;_tr]:border-b">
                <tr className="data-[state=selected]:bg-muted hover:bg-muted/50 border-b transition-colors">
                  <th 
                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 cursor-pointer hover:bg-accent/50 transition-colors"
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
                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 cursor-pointer hover:bg-accent/50 transition-colors"
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
                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 cursor-pointer hover:bg-accent/50 transition-colors"
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
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="[&amp;_tr:last-child]:border-0">
                {recordList()}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}