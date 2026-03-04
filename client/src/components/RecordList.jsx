import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Record = (props) => (
  <tr className="data-[state=selected]:bg-muted hover:bg-muted/50 border-b transition-colors">
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-label">
      {props.record.name}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-label">
      {props.record.position}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-label">
      {props.record.level}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-label">
      <div className="flex gap-2">
        <Link
          className="inline-flex justify-center items-center bg-white hover:bg-gray-200 disabled:opacity-50 px-3 border border-gray-300 hover:border-gray-400 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 h-9 font-label font-medium text-sm whitespace-nowrap transition-colors disabled:pointer-events-none"
          to={`/edit/${props.record._id}`}
        >
          EDIT
        </Link>
        <button
          className="bg-red-50 hover:bg-red-100 disabled:opacity-50 px-3 border border-red-200 hover:border-red-400 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 h-9 font-label font-medium text-sm whitespace-nowrap transition-colors disabled:pointer-events-none"
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
        <div className="p-4 text-label text-center">Loading ...</div>
      ) : error ? (
        <div className="p-4 text-label text-red-500 text-center">Error: {error}</div>
      ) : records.length === 0 ? (
        <div className="p-8 text-center">
          <p className="mb-4 text-gray-500 text-label">No employee records found.</p>
          <Link
            to="/create"
            className="inline-flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-label font-medium text-white text-sm transition-colors disabled:cursor-not-allowed"
          >
            CREATE FIRST EMPLOYEE
          </Link>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm caption-bottom">
              <thead className="[&_tr]:border-b">
                <tr className="hover:bg-gray-50 border-b transition-colors">
                  <th 
                    className="h-12 px-4 text-left align-middle font-medium text-gray-600 [&:has([role=checkbox])]:pr-0 cursor-pointer hover:bg-gray-50 transition-colors font-label"
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
                    className="h-12 px-4 text-left align-middle font-medium text-gray-600 [&:has([role=checkbox])]:pr-0 cursor-pointer hover:bg-gray-50 transition-colors font-label"
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
                    className="h-12 px-4 text-left align-middle font-medium text-gray-600 [&:has([role=checkbox])]:pr-0 cursor-pointer hover:bg-gray-50 transition-colors font-label"
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
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 [&:has([role=checkbox])]:pr-0 font-label">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {recordList()}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}