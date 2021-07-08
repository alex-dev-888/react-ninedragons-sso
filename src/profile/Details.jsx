import React from 'react'
import { Link } from 'react-router-dom'

import { accountService } from '@/_services'

function Details({ match }) {
  const { path } = match
  const user = accountService.userValue

  return (
    <div>
      <h1>Thông tin cá nhân</h1>
      <p>
        <strong>Tên đăng nhập: </strong> {user.username}
        <br />
        <strong>Email: </strong> {user.email}
      </p>
      <p>
        <Link to={`${path}/update`}>Cập nhật</Link>
      </p>
    </div>
  )
}

export { Details }
