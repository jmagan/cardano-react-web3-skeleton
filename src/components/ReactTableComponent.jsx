import React, { useEffect } from 'react';
import { useImperativeHandle } from 'react';
import { forwardRef } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import useAuthAxios from '../hooks/useAuthAxios';

const ReactTableComponent = forwardRef(({ columns, data, fetchData }, ref) => {
  const authAxios = useAuthAxios();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize, sortBy, filters },
  } = useTable(
    {
      columns,
      data: data.docs,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
      manualPagination: true,
      pageCount: data.totalPages,
      manualFilters: true,
      manualSortBy: true,
      disableMultiSort: true,
    },
    useFilters,
    useSortBy,
    usePagination,
  );

  useEffect(() => {
    fetchData(authAxios, pageIndex, pageSize, sortBy, filters);
  }, [pageIndex, pageSize, sortBy, filters, fetchData, authAxios]);

  useImperativeHandle(ref, () => ({
    refreshTable() {
      fetchData(authAxios, pageIndex, pageSize, sortBy, filters);
    },
  }));

  return (
    <>
      <div className="table-responsive">
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr className="align-top" {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th scope="col" key={column.id}>
                    <div {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
                      <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                    </div>
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="table-group-divider" {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr key={row.index} {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return <td key={cell.column.id + ':' + cell.row.index}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="d-flex align-items-center">
          <div className="btn-group me-2" role="group">
            <button className="btn btn-outline-primary" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {'<<'}
            </button>{' '}
            <button className="btn btn-outline-primary" onClick={() => previousPage()} disabled={!canPreviousPage}>
              {'<'}
            </button>{' '}
            <button className="btn btn-outline-primary" onClick={() => nextPage()} disabled={!canNextPage}>
              {'>'}
            </button>{' '}
            <button className="btn btn-outline-primary" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              {'>>'}
            </button>{' '}
          </div>
          <div className="me-2">
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
            | Go to page:{' '}
          </div>
          <div className="me-auto">
            <input
              type="number"
              className="form-control"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: '100px' }}
            />
          </div>{' '}
          <div className="me-1 mb-1">
            <select
              value={pageSize}
              className="form-select"
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[2, 5, 10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
});

export default ReactTableComponent;
