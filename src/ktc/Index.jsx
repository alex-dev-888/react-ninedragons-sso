import React, { useState, useEffect } from 'react'
import NumberFormat from 'react-number-format'

import { accountService, cartService } from '@/_services'

import KTCItem from './KTCItem'

import data from '../_resources/data'

function KTC({ history }) {
  const user = accountService.userValue

  const [listKTC, setListKTC] = useState([])

  const [coin, setCoin] = useState(user?.coin)

  useEffect(() => {
    cartService.getListKTC().then((items) => {
      setListKTC(items)
    })
  }, [])

  useEffect(() => {}, [coin])

  return (
    <>
      <div className='p-4'>
        <div className='container'>
          <h1>Kỳ trân các</h1>
          <h4>
            Số xu hiện có:{' '}
            <span className='text-danger'>
              <NumberFormat
                value={coin}
                displayType={'text'}
                thousandSeparator={true}
                suffix={' coin'}
              />
            </span>
          </h4>

          <div className='row'>
            {listKTC?.map((item) => {
              return (
                <KTCItem
                  item={item}
                  key={item.id}
                  user={user}
                  history={history}
                  setCoin={setCoin}
                />
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export { KTC }
