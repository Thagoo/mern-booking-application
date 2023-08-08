import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useEffect } from "react";
import axios from "axios";
import { ViewUserContext } from "../../context/ViewUserContext";
import { Button } from "@mui/material";

const Datatable = ({ columns }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [list, setList] = useState();
  const { data, loading, error, reFetch } = useFetch(`/${path}`);
  const { dispatch } = useContext(ViewUserContext);

  useEffect(() => {
    setList(data);
    dispatch({ type: "UNSET_USER" });
  }, [data]);

  const handleViewUserClick = async (params) => {
    dispatch({ type: "SET_USER", payload: params });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/${path}/${id}`);
      setList(list.filter((item) => item._id !== id));
      reFetch();
    } catch (err) {}
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {params.row.username && (
              <Link
                to={`/users/${params.row._id}`}
                style={{ textDecoration: "none" }}
              >
                <Button
                  size="small"
                  sx={{
                    boxShadow: `none`,
                    textTransform: `none`,
                  }}
                  onClick={(e) => handleViewUserClick(params.row)}
                >
                  View
                </Button>
              </Link>
            )}
            <Button
              sx={{
                boxShadow: `none`,
                textTransform: `none`,
              }}
              variant="contained"
              size="small"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable ">
      <div className="datatableTitle">
        {path}
        <Link to={`/${path}/new`} className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid cap"
        rows={data}
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Datatable;
