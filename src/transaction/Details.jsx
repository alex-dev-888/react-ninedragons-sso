import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { cartService, accountService } from '@/_services'
import { Tabs, Tab } from 'react-bootstrap'

import Moment from 'moment'

function Details({ match }) {
  const { path } = match
  const user = accountService.userValue

  const [depositList, setDepositList] = useState([])
  const [purchaseList, setPurchaseList] = useState([])

  useEffect(() => {
    cartService.getAllDepositByUserId(user?.id).then((x) => setDepositList(x))
    cartService.getAllPurchaseByUserId(user?.id).then((y) => setPurchaseList(y))
  }, [])

  const [key, setKey] = useState('deposit')

  useEffect(() => {
    if (key === 'deposit') {
    } else if (key === 'purchase') {
    }
  }, [key])

  return (
    <>
      <div>
        <h1>Lịch sử giao dịch</h1>

        <Tabs
          activeKey={key}
          id='uncontrolled-tab-example'
          className='mb-3'
          onSelect={(k) => setKey(k)}
        >
          <Tab eventKey='deposit' title='Nạp tiền'>
            <table className='table table-striped'>
              <thead>
                <tr>
                  <th style={{ width: '4%' }}>STT</th>
                  <th style={{ width: '25%' }}>Thông tin đơn hàng</th>
                  <th style={{ width: '11%' }}>Số tiền</th>
                  <th style={{ width: '15%' }}>Ngân hàng đích</th>
                  <th style={{ width: '10%' }}>Số xu</th>
                  <th style={{ width: '20%' }}>Ngày khởi tạo</th>
                  <th style={{ width: '15%' }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {depositList?.map((deposit, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{deposit?.orderId} </td>
                    <td>{deposit?.amount.toLocaleString()}</td>
                    <td>{deposit?.bank}</td>
                    <td>{deposit?.coin_receive}</td>

                    <td>
                      {Moment(deposit?.created).format('DD/MM/YYYY HH:mm:ss')}
                    </td>
                    <td>
                      {deposit?.isActived === true
                        ? 'Thành công'
                        : 'Đang xử lý'}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}></td>
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
          </Tab>
          <Tab eventKey='purchased' title='Mua vật phẩm'>
            <table className='table table-striped'>
              <thead>
                <tr>
                  <th style={{ width: '4%' }}>STT</th>
                  <th style={{ width: '65%' }}>Vật phẩm</th>
                  <th style={{ width: '11%' }}>Số xu</th>
                  <th style={{ width: '20%' }}>Ngày khởi tạo</th>
                </tr>
              </thead>
              <tbody>
                {purchaseList?.map((purchase, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {purchase?.orderName}{' '}
                      {purchase?.type === 'CS'
                        ? ` - char name: ${purchase?.chr_name}`
                        : ''}
                    </td>
                    <td>{purchase?.amount.toLocaleString()}</td>
                    <td>
                      {Moment(purchase?.created).format('DD/MM/YYYY HH:mm:ss')}
                    </td>
                  </tr>
                ))}
                {!purchaseList && (
                  <tr>
                    <td colSpan='4' className='text-center'>
                      <span className='spinner-border spinner-border-lg align-center'></span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Tab>
        </Tabs>
      </div>
    </>
  )
}

export { Details }
