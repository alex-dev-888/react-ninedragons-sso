import React from 'react'
import { Link } from 'react-router-dom'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import { accountService, alertService } from '@/_services'

function Login({ history, location }) {
  const initialValues = {
    username: '',
    password: '',
  }

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Tên đăng nhập không được để trống'),
    password: Yup.string().required('Mật khẩu không được để trống'),
  })

  function onSubmit({ username, password }, { setSubmitting }) {
    alertService.clear()
    accountService
      .login(username, password)
      .then(() => {
        const { from } = location.state || { from: { pathname: '/' } }
        history.push(from)
      })
      .catch((error) => {
        setSubmitting(false)
        alertService.error(error)
      })
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <h3 className='card-header'>Đăng nhập</h3>
          <div className='card-body'>
            <div className='form-group'>
              <label>Tên đăng nhập</label>
              <Field
                name='username'
                type='text'
                className={
                  'form-control' +
                  (errors.username && touched.username ? ' is-invalid' : '')
                }
              />
              <ErrorMessage
                name='username'
                component='div'
                className='invalid-feedback'
              />
            </div>
            <div className='form-group'>
              <label>Mật khẩu</label>
              <Field
                name='password'
                type='password'
                className={
                  'form-control' +
                  (errors.password && touched.password ? ' is-invalid' : '')
                }
              />
              <ErrorMessage
                name='password'
                component='div'
                className='invalid-feedback'
              />
            </div>
            <div className='form-row'>
              <div className='form-group col'>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='btn btn-primary'
                >
                  {isSubmitting && (
                    <span className='spinner-border spinner-border-sm mr-1'></span>
                  )}
                  Đăng nhập
                </button>
                <Link to='register' className='btn btn-link'>
                  Đăng ký
                </Link>
              </div>
              <div className='form-group col text-right'>
                <Link to='forgot-password' className='btn btn-link pr-0'>
                  Quên mật khẩu
                </Link>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export { Login }
