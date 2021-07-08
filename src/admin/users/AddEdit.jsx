import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import { accountService, alertService } from '@/_services'

function AddEdit({ history, match }) {
  const { id } = match.params
  const isAddMode = !id

  const initialValues = {
    username: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
    coin: 0,
  }

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('User name is required'),
    coin: Yup.number().required('Coin is required').min(0, '0 is minimum'),
    email: Yup.string().email('Email is invalid').required('Email is required'),
    role: Yup.string().required('Role is required'),
    password: Yup.string()
      .concat(isAddMode ? Yup.string().required('Password is required') : null)
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .when('password', (password, schema) => {
        if (password) return schema.required('Confirm Password is required')
      })
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  })

  function onSubmit(fields, { setStatus, setSubmitting }) {
    setStatus()
    if (isAddMode) {
      createUser(fields, setSubmitting)
    } else {
      updateUser(id, fields, setSubmitting)
    }
  }

  function createUser(fields, setSubmitting) {
    accountService
      .create(fields)
      .then(() => {
        alertService.success('User added successfully', {
          keepAfterRouteChange: true,
        })
        history.push('.')
      })
      .catch((error) => {
        setSubmitting(false)
        alertService.error(error)
      })
  }

  function updateUser(id, fields, setSubmitting) {
    accountService
      .update(id, fields)
      .then(() => {
        alertService.success('Update successful', {
          keepAfterRouteChange: true,
        })
        history.push('..')
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
      {({ errors, touched, isSubmitting, setFieldValue }) => {
        useEffect(() => {
          if (!isAddMode) {
            // get user and set form fields
            accountService.getById(id).then((user) => {
              const fields = ['username', 'coin', 'email', 'role']
              fields.forEach((field) =>
                setFieldValue(field, user[field], false)
              )
            })
          }
        }, [])

        return (
          <Form>
            <h1>{isAddMode ? 'Add User' : 'Edit User'}</h1>
            <div className='form-row'>
              <div className='form-group col-md-6 col-sm-12'>
                <label>Username</label>
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
                <label>Xu</label>
                <Field
                  name='coin'
                  type='number'
                  className={
                    'form-control' +
                    (errors.coin && touched.coin ? ' is-invalid' : '')
                  }
                />
                <ErrorMessage
                  name='coin'
                  component='div'
                  className='invalid-feedback'
                />
              </div>
            </div>
            <div className='form-row'>
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
              <div className='form-group col-md-6 col-sm-12'>
                <label>Role</label>
                <Field
                  name='role'
                  as='select'
                  className={
                    'form-control' +
                    (errors.role && touched.role ? ' is-invalid' : '')
                  }
                >
                  <option value=''></option>
                  <option value='User'>User</option>
                  <option value='Admin'>Admin</option>
                </Field>
                <ErrorMessage
                  name='role'
                  component='div'
                  className='invalid-feedback'
                />
              </div>
            </div>
            {!isAddMode && (
              <div>
                <h3 className='pt-3'>Change Password</h3>
                <p>Leave blank to keep the same password</p>
              </div>
            )}
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
                <label>Confirm Password</label>
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
                Save
              </button>
              <Link to={isAddMode ? '.' : '..'} className='btn btn-link'>
                Cancel
              </Link>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export { AddEdit }
