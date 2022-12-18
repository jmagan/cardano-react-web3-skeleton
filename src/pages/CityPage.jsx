import React, { useMemo, useState, useCallback, useRef } from 'react';
import CityEditModal from '../components/cityEditModal';
import ReactTableComponent from '../components/reactTableComponent';
import useAuthAxios from '../hooks/useAuthAxios';

export default function CityPage() {
  const authAxios = useAuthAxios();

  const [errorMessage, setErrorMessage] = useState([]);

  const tableRef = useRef();
  const [data, setData] = useState({ docs: [], totalDocs: 0 });

  const [openModal, setOpenModal] = useState(false);
  const [cityId, setCityId] = useState(null);

  const closeModalCB = useCallback(() => {
    setOpenModal(false);
    tableRef.current.refreshTable();
    setCityId(null);
  }, []);

  function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
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

  const actionsCell = (cell) => {
    return (
      <div>
        <i
          className="bi bi-pencil-square me-3"
          onClick={() => {
            setCityId(cell.value);
            setOpenModal(true);
          }}
        ></i>
        <i
          className="bi bi-trash"
          onClick={() => {
            if (window.confirm('Are you sure?')) {
              deleteCity(cell.value);
            }
          }}
        ></i>
      </div>
    );
  };

  const deleteCity = async (cityId) => {
    await authAxios.delete(`/cities/${cityId}`);
    tableRef.current.refreshTable();
  };

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
  }, []);

  const fetchData = useCallback(async (authAxios, pageIndex, pageSize, sortBy, filters) => {
    try {
      const response = await authAxios.get('/cities', {
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
                  <h1>Cities</h1>
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
                      setCityId(null);
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
      <CityEditModal open={openModal} closeCB={closeModalCB} cityId={cityId} />
    </div>
  );
}
