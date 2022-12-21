import React, { useState, useRef, useCallback, useMemo } from 'react';
import useAuthAxios from '../hooks/useAuthAxios';
import ReactTableComponent from '../components/ReactTableComponent';
import UserEditModal from '../components/UserEditModal';

export default function UserPage() {
  const authAxios = useAuthAxios();

  const [errorMessage, setErrorMessage] = useState([]);

  const tableRef = useRef();
  const [data, setData] = useState({ docs: [], totalDocs: 0 });

  const [openModal, setOpenModal] = useState(false);
  const [userId, setUserId] = useState(null);

  const closeModalCB = useCallback(() => {
    setOpenModal(false);
    tableRef.current.refreshTable();
    setUserId(null);
  }, []);

  function DefaultColumnFilter({ column: { filterValue, setFilter } }) {
    return (
      <input
        className="form-control"
        value={filterValue || ''}
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
      />
    );
  }

  const deleteUser = useCallback(
    async (userId) => {
      await authAxios.delete(`/users/${userId}`);
      tableRef.current.refreshTable();
    },
    [authAxios],
  );

  const actionsCell = useCallback(
    (cell) => {
      return (
        <div>
          <i
            className="bi bi-pencil-square me-3"
            onClick={() => {
              setUserId(cell.value);
              setOpenModal(true);
            }}
          ></i>
          <i
            className="bi bi-trash"
            onClick={() => {
              if (window.confirm('Are you sure?')) {
                deleteUser(cell.value);
              }
            }}
          ></i>
        </div>
      );
    },
    [deleteUser],
  );

  const columns = useMemo(() => {
    return [
      {
        Header: 'Actions',
        accessor: '_id',
        disableFilters: true,
        Cell: actionsCell,
      },
      {
        Header: 'Name',
        accessor: 'name',
        Filter: DefaultColumnFilter,
        filter: 'include',
      },
      {
        Header: 'E-mail',
        accessor: 'email',
        Filter: DefaultColumnFilter,
        filter: 'include',
      },
      {
        Header: 'Verified',
        accessor: 'verified',
        Filter: DefaultColumnFilter,
        filter: 'include',
      },
      {
        Header: 'Role',
        accessor: 'role',
        Filter: DefaultColumnFilter,
        filter: 'include',
      },
      {
        Header: 'City',
        accessor: 'city',
        Filter: DefaultColumnFilter,
        filter: 'include',
      },
      {
        Header: 'Country',
        accessor: 'country',
        Filter: DefaultColumnFilter,
        filter: 'include',
      },
      {
        Header: 'Phone',
        accessor: 'phone',
        Filter: DefaultColumnFilter,
        filter: 'include',
      },
      {
        Header: 'Created At',
        accessor: 'createdAt',
        disableFilters: true,
        Cell: (cell) => new Date(cell.value).toLocaleString(),
      },
      {
        Header: 'Updated At',
        accessor: 'updatedAt',
        disableFilters: true,
        Cell: (cell) => new Date(cell.value).toLocaleString(),
      },
    ];
  }, [actionsCell]);

  const fetchData = useCallback(async (authAxios, pageIndex, pageSize, sortBy, filters) => {
    try {
      const response = await authAxios.get('/users', {
        params: {
          page: pageIndex + 1,
          limit: pageSize,
          sort: sortBy[0] ? sortBy[0].id : '',
          order: sortBy[0] ? (sortBy[0].desc ? -1 : 1) : '',
          fields: filters.length > 0 ? filters.map((filter) => filter.id).join(',') : undefined,
          filter: filters.length > 0 ? filters.map((filter) => filter.value.replace(',', '')).join(',') : undefined,
        },
      });

      console.log(response.data);
      setData(response.data);
    } catch (error) {
      if (!error?.response) {
        setErrorMessage(['No Server Response']);
      } else if (error?.response?.data?.errors && Array.isArray(error.response.data.errors.msg)) {
        setErrorMessage(error.response.data.errors.msg.map((val) => val.param + ': ' + val.msg));
      } else if (error.response?.data?.errors) {
        setErrorMessage([error.response.data.errors.msg]);
      }
    }
  }, []);

  return (
    <div className="container">
      <section className="vh-100">
        <div className="container h-100">
          <div className="row h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card mt-5">
                <div className="card-header text-center">
                  <h1>Users</h1>
                </div>
                <div className="card-body">
                  {errorMessage.length > 0 && (
                    <div className="alert alert-danger" role="alert">
                      {errorMessage.map((error) => {
                        return (
                          <>
                            {error} <br />
                          </>
                        );
                      })}
                    </div>
                  )}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setUserId(null);
                      setOpenModal(true);
                    }}
                  >
                    New
                  </button>
                  <ReactTableComponent ref={tableRef} columns={columns} data={data} fetchData={fetchData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <UserEditModal open={openModal} closeCB={closeModalCB} userId={userId} />
    </div>
  );
}
