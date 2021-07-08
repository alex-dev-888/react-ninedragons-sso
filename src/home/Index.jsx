import React, { useState, useEffect } from 'react'
import NumberFormat from 'react-number-format'

import { accountService, cartService } from '@/_services'

import ItemDeposit from './ItemDeposit'

import data from '../_resources/data'

function Home({ history }) {
  const user = accountService.userValue

  const [listDepositBonus, setListDepositBonus] = useState([])

  useEffect(() => {
    cartService
      .getListDepositBonus()
      .then((items) => setListDepositBonus(items))
  }, [])

  return (
    <>
      <div className='p-4'>
        <div className='container'>
          <h1>Xin chào bằng hữu {user?.username}!</h1>
          <h4>
            Số xu hiện có:{' '}
            <span className='text-danger'>
              <NumberFormat
                value={user.coin}
                displayType={'text'}
                thousandSeparator={true}
                suffix={' xu'}
              />
            </span>
          </h4>
          <div className='row mb-3'>
            <div className='col-sm-12'>
              <div className='card'>
                <div className='card-header'>Thông tin chuyển khoản</div>
                <div className='card-body'>
                  <p className='card-text'>
                    + Chọn "Lấy mã" tại mỗi gói muốn nạp.
                  </p>
                  <p className='card-text'>
                    + Chuyển khoản tới 1 trong các tài khoản bên dưới.
                  </p>
                  <p className='card-text'>
                    + Nội dung chuyển khoản chỉ chứa duy nhất mã vừa lấy bên
                    trên (Vui lòng cung cấp chính xác để rút ngắn quá trình giao
                    dịch).
                  </p>
                  <p className='card-text'>
                    + Chọn Xác nhận để hoàn tất. Vui lòng đợi trong 15 phút.
                  </p>
                  <p className='text-danger'>
                    Lưu ý: Không ghi nạp tiền hay bất cứ thông tin nào khác.
                  </p>
                  {data?.fund_transfer.map((fund) => {
                    return (
                      <p className='card-text'>
                        <span className='text-primary'>{fund?.bank}</span> -{' '}
                        <span className='text-success'>
                          {fund?.account_name}
                        </span>{' '}
                        -{' '}
                        <span className='text-danger'>
                          {fund?.account_number}
                        </span>
                      </p>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            {listDepositBonus?.map((item) => {
              return (
                <ItemDeposit
                  item={item}
                  key={item.id}
                  user={user}
                  history={history}
                  fund_transfer={data?.fund_transfer}
                />
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export { Home }
