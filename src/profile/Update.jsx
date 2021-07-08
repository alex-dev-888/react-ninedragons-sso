import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import { accountService, alertService } from '@/_services'

function Update({ history }) {
  const user = accountService.userValue
  const initialValues = {
    username: user.username,
    email: user.email,
    password: '',
    confirmPassword: '',
  }

  const validationSchema = Yup.object().shape({
    // username: Yup.string()
    //     .required('First Name is required'),
    // lastName: Yup.string()
    //     .required('Last Name is required'),
    // email: Yup.string()
    //     .email('Email is invalid')
    //     .required('Email is required'),

    password: Yup.string()
      .min(6, 'Mật khẩu phải chứa ít nhất 6 ký tự')
      .required('Mật khẩu không được để trống'),
    confirmPassword: Yup.string()
      .when('password', (password, schema) => {
        if (password)
          return schema.required('Nhập lại mật khẩu không được để trống')
      })
      .oneOf([Yup.ref('password')], 'Mật khẩu không giống nhau')
      .required('Nhập lại mật khẩu không được để trống'),
  })

  function onSubmit(fields, { setStatus, setSubmitting }) {
    setStatus()
    accountService
      .update(user.id, fields)
      .then(() => {
        alertService.success('Cập nhật thông tin thành công', {
          keepAfterRouteChange: true,
        })
        history.push('.')
      })
      .catch((error) => {
        setSubmitting(false)
        alertService.error(error)
      })
  }

  //   const [isDeleting, setIsDeleting] = useState(false)
  //   function onDelete() {
  //     if (confirm('Bạn có chắc không?')) {
  //       setIsDeleting(true)
  //       accountService
  //         .delete(user.id)
  //         .then(() => alertService.success('Account deleted successfully'))
  //     }
  //   }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          {/* <h1>Cập nhật thông tin</h1> */}

          <h3 className='pt-3'>Đổi mật khẩu</h3>
          <div className='form-row'>
            <div className='form-group col-md-6 col-sm-12 col-xs-12'>
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
            <div className='form-group col-md-6 col-sm-12 col-xs-12'>
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
              className='btn btn-primary mr-2'
            >
              {isSubmitting && (
                <span className='spinner-border spinner-border-sm mr-1'></span>
              )}
              Cập nhật
            </button>
            {/* <button
              type='button'
              onClick={() => onDelete()}
              className='btn btn-danger'
              style={{ width: '75px' }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className='spinner-border spinner-border-sm'></span>
              ) : (
                <span>Delete</span>
              )}
            </button> */}
            <Link to='.' className='btn btn-link'>
              Hủy bỏ
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export { Update }
