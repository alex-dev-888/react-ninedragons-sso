import React from 'react'
import { Link } from 'react-router-dom'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import { accountService, alertService } from '@/_services'

function Register({ history }) {
  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Tên đăng nhập không được bỏ trống'),
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Email không được bỏ trống'),
    password: Yup.string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .required('Mật khẩu không được để trống'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Mật khẩu không giống nhau')
      .required('Nhập lại mật khẩu không được để trống'),
  })

  function onSubmit(fields, { setStatus, setSubmitting }) {
    setStatus()
    accountService
      .register(fields)
      .then(() => {
        alertService.success('Đăng ký thành công.', {
          keepAfterRouteChange: true,
        })
        history.push('login')
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
          <h3 className='card-header'>Đăng ký tài khoản</h3>
          <div className='card-body'>
            <div className='form-row'>
              <div className='form-group col-md-6 col-sm-12'>
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
              <div className='form-group col-md-6 col-sm-12'>
                <label>Email</label>
                <Field
                  name='email'
                  type='text'
                  className={
                    'form-control' +
                    (errors.email && touched.email ? ' is-invalid' : '')
                  }
                />
                <ErrorMessage
                  name='email'
                  component='div'
                  className='invalid-feedback'
                />
              </div>
            </div>

            <div className='form-row'>
              <div className='form-group col-md-6 col-sm-12'>
                <label>Password</label>
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
              <div className='form-group col-md-6 col-sm-12'>
                <label>Nhập lại mật khẩu</label>
                <Field
                  name='confirmPassword'
                  type='password'
                  className={
                    'form-control' +
                    (errors.confirmPassword && touched.confirmPassword
                      ? ' is-invalid'
                      : '')
                  }
                />
                <ErrorMessage
                  name='confirmPassword'
                  component='div'
                  className='invalid-feedback'
                />
              </div>
            </div>

            <div className='form-group'>
              <button
                type='submit'
                disabled={isSubmitting}
                className='btn btn-primary'
              >
                {isSubmitting && (
                  <span className='spinner-border spinner-border-sm mr-1'></span>
                )}
                Đăng ký
              </button>
              <Link to='login' className='btn btn-link'>
                Hủy bỏ
              </Link>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export { Register }
