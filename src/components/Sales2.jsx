const Sales2 = () => {
  return (
    <div>
      <h1>Sales2</h1>
      <div>
        <input type="text" placeholder="Search by Store name" />
        <input type="text" placeholder="Search by Day" />
        <input type="text" placeholder="Search by Hour" />
        <button>Search</button>
        <button>Clear Filters</button>
      </div>

      <div>
        <table>
          <thead>
            <tr>
              <th>Store Name</th>
              <th>Store Code</th>
              <th>Amount</th>
              <th>Hour</th>
              <th>Day</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id}>
                <td>{row.StoreName}</td>
                <td>{row.StoreCode}</td>
                <td>{row.Amount}</td>
                <td>{row.Hour}</td>
                <td>{row.Day}</td>
                <td>{row.Date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales2;
