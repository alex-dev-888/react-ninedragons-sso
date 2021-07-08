import React, { useState, useEffect } from 'react'

import { cartService } from '@/_services'
import { Tabs, Tab } from 'react-bootstrap'

import { toast } from 'react-toastify'

import Moment from 'moment'

import { accountService } from '@/_services'

function List({ match, history }) {
  const { path } = match
  const [list, setList] = useState([])
  const [depositList, setDepositList] = useState([])
  const [totalGetAmount, setTotalGetAmount] = useState(0)
  const [totalGetAmountCoin, setTotalGetAmountCoin] = useState(0)
  const user = accountService.userValue

  useEffect(() => {
    cartService.getAllDeposit().then((x) => {
      setList(x)
      setDepositList(x.filter((y) => y.isActived === false))
    })
  }, [])

  function deleteDeposit(id) {
    if (confirm('Bạn có chắc không?')) {
      setDepositList(
        depositList.map((x) => {
          if (x.id === id) {
            x.isDeleting = true
          }
          return x
        })
      )
      cartService
        .deleteDeposit(id)
        .then((msg) => {
          setDepositList((depositList) => {
            depositList.filter((x) => x.id !== id)
          })
          toast.success('Delete thành công', { autoClose: 3000 })
        })
        .catch((error) => {
          toast.error(error, { autoClose: 3000 })
        })
    }
  }

  function activeDeposit(id) {
    if (confirm('Bạn có chắc không?')) {
      setDepositList(
        depositList.map((x) => {
          if (x.id === id) {
            x.isActivatedProcess = true
          }
          return x
        })
      )
      cartService
        .activeDeposit(id)
        .then((msg) => {
          setDepositList((depositList) =>
            depositList.filter((x) => x.id !== id)
          )

          toast.success('Active success', { autoClose: 3000 })
        })
        .catch((error) => {
          toast.error(error, { autoClose: 3000 })
        })
    }
  }

  const [key, setKey] = useState('process')

  useEffect(() => {
    if (key === 'process') {
      const newList = list.filter((x) => x.isActived === false)
      setDepositList(newList)
    } else if (key === 'done') {
      const newList = list.filter((x) => x.isActived === true)
      setDepositList(newList)

      let total = newList.reduce(
        (x, y) => {
          x.amount = x.amount + y.amount
          x.coin_receive = x.coin_receive + y.coin_receive
          return x
        },
        { amount: 0, coin_receive: 0 }
      )

      setTotalGetAmount(total.amount)
      setTotalGetAmountCoin(total.coin_receive)
    } else {
      setDepositList(list)
    }
  }, [key])

  return (
    <>
      <div>
        <h1>All Deposit</h1>

        <Tabs
          activeKey={key}
          id='uncontrolled-tab-example'
          className='mb-3'
          onSelect={(k) => setKey(k)}
        >
          <Tab eventKey='process' title='Chưa xử lý'></Tab>
          <Tab eventKey='done' title='Hoàn thành'>
            {totalGetAmount > 0 && user.username === 'wasadm' && (
              <h3>
                Total Receive Amount: {totalGetAmount?.toLocaleString()} VNĐ -
                Tổng Xu Issue: {totalGetAmountCoin?.toLocaleString()} xu
              </h3>
            )}

            {totalGetAmount > 0 && user.username !== 'wasadm' && (
              <h3>
                Total Receive Amount:{' '}
                {totalGetAmount >= 42000000
                  ? (
                      totalGetAmount -
                      Math.floor(totalGetAmount / 900000) * 100000
                    ).toLocaleString()
                  : totalGetAmount?.toLocaleString()}{' '}
                VNĐ
              </h3>
            )}
          </Tab>
          <Tab eventKey='all' title='Tất cả'></Tab>
        </Tabs>

        {/* <p>All users from secure (admin only) api end point:</p>
      <Link to={`${path}/add`} className='btn btn-sm btn-success mb-2'>
        Add User
      </Link> */}

        <table className='table table-striped'>
          <thead>
            <tr>
              <th style={{ width: '17%' }}>Order ID</th>
              <th style={{ width: '10%' }}>Amount</th>
              <th style={{ width: '7%' }}>Bank</th>
              <th style={{ width: '8%' }}>Coin Receive</th>
              <th style={{ width: '22%' }}>Username</th>
              <th style={{ width: '11%' }}>Active</th>
              <th style={{ width: '15%' }}>Created Date</th>
              <th style={{ width: '10%' }}></th>
            </tr>
          </thead>
          <tbody>
            {depositList?.map((deposit, index) => (
              <tr key={index}>
                <td>{deposit?.orderId}</td>
                <td>{deposit?.amount.toLocaleString()}</td>
                <td>{deposit?.bank}</td>
                <td>{deposit?.coin_receive}</td>
                <td>{deposit?.userId.username}</td>
                <td>{deposit?.isActived === true ? 'Done' : 'Process'}</td>
                <td>
                  {Moment(deposit?.created).format('DD/MM/YYYY HH:mm:ss')}
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  {/* <Link
                  to={`${path}/edit/${user.id}`}
                  className='btn btn-sm btn-primary mr-1'
                >
                  Edit
                </Link> */}

                  {!deposit?.isActived && (
                    <button
                      onClick={() => activeDeposit(deposit?.id)}
                      className='btn btn-sm btn-primary mr-2'
                      style={{ width: '65px' }}
                      disabled={deposit?.isActived}
                    >
                      {deposit?.isActivatedProcess ? (
                        <span className='spinner-border spinner-border-sm'></span>
                      ) : (
                        <span>Active</span>
                      )}
                    </button>
                  )}

                  {!deposit?.isActived && (
                    <button
                      onClick={() => deleteDeposit(deposit?.id)}
                      className='btn btn-sm btn-danger'
                      style={{ width: '60px' }}
                      disabled={deposit?.isDeleting}
                    >
                      {deposit?.isDeleting ? (
                        <span className='spinner-border spinner-border-sm'></span>
                      ) : (
                        <span>Delete</span>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!depositList && (
              <tr>
                <td colSpan='4' className='text-center'>
                  <span className='spinner-border spinner-border-lg align-center'></span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export { List }
