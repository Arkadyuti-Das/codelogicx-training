
import ProductModal from './ProductModal';
import axios from 'axios';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import DeleteModal from './DeleteModal';
import ImageModal from './ImageModal';
import { base_url } from '../constants/links';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type ProductItem={
  id: string;
  name: string;
  description: string;
  price: number;
  image: string
}

export default function DataTable() {
  const [searchValues, setSearchValues]=useState<string>("");
  const [debouncedSearch, setDebouncedSearch]=useState<string>("");

  const [rowCount, setRowCount]=useState<string>("1");
  const [sortField, setSortField]=useState<string>("");
  const [sortBy, setSortBy]=useState<string>("");
  const [queryParams, setQueryParams]=useState<{sortField:string, sortBy:string}|null>(null);

  const [page, setPage]=useState<number>(0);
  const [totalRecords, setTotalRecords]=useState<number>(0);
  const [pageStartingRecord, setPageStartingRecord]=useState<number>(0);
  const [pageEndingRecord, setPageEndingRecord]=useState<number>(0);
  const [totalPage, setTotalPage]=useState<number>(0);

  const [token, setToken]=useState<string|null>(null);

  const handleRowsCount=(event:ChangeEvent<HTMLSelectElement>)=>{
    setRowCount(event.target.value);
    setPage(0);
  }

  const handleApply=()=>{
    if(sortField && sortBy){
      setQueryParams({sortField, sortBy});
      productQuery.refetch();
    }
    else{
      toast.warn("Please select both field and order!!!");
    }
  }

  useEffect(()=>{
    const interval=setTimeout(()=>{
      setDebouncedSearch(searchValues)
    }, 1000);
    return ()=>clearTimeout(interval);
  },[searchValues])

  useEffect(()=>{
    setToken(localStorage.getItem("token"));
  },[token]);

  async function fetchProduct(searchValues:string, rowsPerPage:string, page:number){
    // toast.success("first render")
    const res=await axios.get(`${base_url}/get-products`, {
      headers:{
        Authorization: `Bearer ${token}`
      },
      params:{searchValues, rowsPerPage, sortField, sortBy, page}});
    // console.log(res.data.totalCount)
    setTotalRecords(res.data.totalCount);
    setPageStartingRecord(res.data.startingRecordNumber);
    setPageEndingRecord(res.data.endingRecordNumber);
    setTotalPage(res.data.totalPages);
    return res.data.data;
  }

  const productQuery=useQuery({queryKey: ["products", debouncedSearch, rowCount, page, queryParams], queryFn: ()=>fetchProduct(debouncedSearch, rowCount, page), placeholderData: keepPreviousData, staleTime:1000*60*5});

  const handleSearchInput=(event:ChangeEvent<HTMLInputElement>)=>{
    setSearchValues(event.target.value);
  }

  if (productQuery.data){
    return (
      <>
      <div className='w-full px-4'>
        <p className='font-semibold text-xl'>Search Product</p>
        <input type="text" name="productSearch" autoComplete='off' value={searchValues} onChange={handleSearchInput} className='border-2 border-slate-950 rounded-lg px-4 py-2 text-slate-950 w-1/4' />
      </div>
      <div className='w-full flex justify-start space-x-10 px-4 py-6'>
        <div className='flex items-center space-x-4'>
          <p className='font-semibold text-lg'>Sort By</p>
          <select name="sortby" className='border-2 border-slate-900' value={sortField} onChange={(event:ChangeEvent<HTMLSelectElement>)=>{setSortField(event.target.value)}}>
            <option value="">Select A Field</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>
        </div>
        <div className='flex items-center space-x-4'>
          <p className='font-semibold text-lg'>Sort Order</p>
          <select name="sortby" className='border-2 border-slate-900' value={sortBy} onChange={(event:ChangeEvent<HTMLSelectElement>)=>{setSortBy(event.target.value)}}>
            <option value="">Select An Order</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div>
          <button onClick={handleApply} className='border-2 border-slate-900 rounded-lg px-4 py-1 bg-slate-200 font-semibold'>Apply</button>
        </div>
      </div>
      {productQuery.data.length==0? <><p>No data...Nothing to show...</p></>:<>
      <div>
      </div>
      <div className='w-full h-[50dvh] overflow-hidden overflow-y-auto relative'>
      <table className='border-2 border-black w-full px-4 border-collapse'>
        <thead className='bg-gray-200 sticky top-[-1px] z-20'>
          <tr>
            <th>Product Name</th>
            <th>Image</th>
            <th>Price</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className='relative z-10 bg-gray-300'>
          {productQuery.data?.map((items:ProductItem)=>{
            return <tr key={items.id} className='border-2 border-slate-800'>
              <td className='text-center'>{items.name}</td>
              <td className='flex justify-center'>
                <div className='flex justify-center items-center'>
                  <ImageModal imagePath={`http://localhost:3000/${items.image}`}/>
                </div>
              </td>
              <td className='text-center'>{items.price}</td>
              <td className='text-center'>{items.description}</td>
              <td>
                <div className='flex justify-center items-center'>
                  <ProductModal buttonText='Edit' submitText='Update Product' product_id={items.id} product_name={items.name} product_price={items.price.toString()} product_description={items.description} className='mr-6 px-6 py-1 rounded-lg text-slate-200 bg-blue-600 font-semibold'/>
                  <DeleteModal product_id={items.id} />
                </div>
              </td>
              </tr>
          })}
        </tbody>
      </table>
      </div>
      <div className='w-full flex items-center justify-center space-x-10'>
        <div className='flex items-center space-x-4'>
          <p className='font-semibold text-lg'>Rows Per Page</p>
          <select name="selectRows" value={rowCount} onChange={handleRowsCount} className='border-2 border-slate-900'>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="5">5</option>
          </select>
        </div>
        <div>
          <p className='font-semibold text-lg'>Showing {pageStartingRecord}-{pageEndingRecord} Of {totalRecords} Records</p>
        </div>
        <div className='flex items-center space-x-6'>
          <button className='bg-slate-200 text-slate-900 border-2 rounded-2xl border-rose-600 px-3 py-2 font-bold' disabled={page===0} onClick={()=>{setPage(0)}}>{"<<"}</button>
          <button className='bg-slate-200 text-slate-900 border-2 rounded-2xl border-rose-600 px-2 py-2 font-semibold' disabled={page===0} onClick={()=>{setPage((prev)=>prev-1)}}>Prev</button>
          <p className='font-semibold'>Page - {page+1}</p>
          <button className='bg-slate-200 text-slate-900 border-2 rounded-2xl border-rose-600 px-2 py-2 font-semibold' disabled={page===totalPage-1} onClick={()=>{setPage((prev)=>prev+1)}}>Next</button>
          <button className='bg-slate-200 text-slate-900 border-2 rounded-2xl border-rose-600 px-3 py-2 font-bold' disabled={page===totalPage-1} onClick={()=>{setPage(totalPage-1)}}>{">>"}</button>
        </div>
      </div>
      </>}
      </>
    );
  }

  if (productQuery.isLoading){
    return (
      <p>Loading...</p>
    )
  }

  if (productQuery.isError){
    return (
      <p>OOPS!!! An error occurred</p>
    )
  }
}
