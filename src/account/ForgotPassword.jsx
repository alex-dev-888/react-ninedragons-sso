import React from 'react'
import { Link } from 'react-router-dom'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import { accountService, alertService } from '@/_services'

function ForgotPassword() {
  const initialValues = {
    email: '',
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Email không được để trống'),
  })

  function onSubmit({ email }, { setSubmitting }) {
    alertService.clear()
    accountService
      .forgotPassword(email)
      .then(() => alertService.success('Kiểm tra email để lấy lại mật khẩu'))
      .catch((error) => alertService.error(error))
      .finally(() => setSubmitting(false))
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <h3 className='card-header'>Quên mật khẩu</h3>
          <div className='card-body'>
            <div className='form-group'>
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
                  Lấy lại mật khẩu
                </button>
                <Link to='login' className='btn btn-link'>
                  Hủy bỏ
                </Link>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export { ForgotPassword }
