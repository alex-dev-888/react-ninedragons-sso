import React, { useState, useEffect } from 'react'
import NumberFormat from 'react-number-format'

import ModalDeposit from './ModalDeposit'

import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import { Button, ButtonToolbar, Modal } from 'react-bootstrap'

import { cartService, alertService } from '@/_services'

import { toast } from 'react-toastify'

const ItemDeposit = ({ item, user, history, fund_transfer }) => {
  const [showInfo, setShowInfo] = useState(false)
  const [orderInfo, setOrderInfo] = useState('')

  //Modal
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  //end Modal

  const generateOrderInfo = () => {
    setOrderInfo(`${user?.username}_${item?.id}_${new Date().getTime()}`)
    setShowInfo(!showInfo)
  }

  const initialValues = {
    orderId: '',
    amount: '',
    userId: user.id,
    bank: '',
  }

  const validationSchema = Yup.object().shape({
    orderId: Yup.string().required('Nội dung chuyển tiền không được để trống'),
    amount: Yup.string().required('Số tiền không được để trống'),
    bank: Yup.string().required('Ngân hàng không được để trống'),
    // .positive()
    // .integer()
    // .min(1),
  })

  function onSubmit(fields, { setStatus, setSubmitting }) {
    setStatus()
    cartService
      .confirmDeposit(fields)
      .then(() => {
        // alertService.success(
        //   'Xác nhận chuyển tiền thành công. Vui lòng đợi chúng tôi kiểm tra và phê duyệt.',
        //   { keepAfterRouteChange: true, autoClose: false }
        // )
        handleClose()
        history.push('/')
        toast.success(
          'Xác nhận chuyển tiền thành công. Vui lòng đợi chúng tôi kiểm tra và phê duyệt.',
          { autoClose: 3000 }
        )
      })
      .catch((error) => {
        setSubmitting(false)
        // alertService.error(error, { autoClose: false })
        handleClose()
        history.push('/')
        toast.error(error, { autoClose: 3000 })
      })
  }

  return (
    <>
      <div className='col-sm-12 col-md-6 mb-3'>
        <div className='card'>
          <div className='card-header'>
            Gói {item?.id} -{' '}
            <NumberFormat
              value={item?.price}
              displayType={'text'}
              thousandSeparator={true}
              suffix={' VNĐ'}
            />
          </div>
          <div className='card-body'>
            <h5 className='card-title'>
              Số xu nhận được:{' '}
              <span className='text-danger'>
                <NumberFormat
                  value={item?.coin}
                  displayType={'text'}
                  thousandSeparator={true}
                  suffix={' xu'}
                />
              </span>
            </h5>
            <p className='card-text'>{item?.desc}</p>
            {showInfo && (
              <p className='card-text'>
                Nội dung chuyển khoản:
                <br />
                <code className='mr-2'>{orderInfo}</code>
                <button
                  type='button'
                  className='btn btn-link'
                  onClick={() => {
                    navigator.clipboard.writeText(orderInfo)
                  }}
                >
                  Sao chép
                </button>
              </p>
            )}
            <button
              type='button'
              className='btn btn-primary mr-3'
              onClick={() => generateOrderInfo()}
            >
              Lấy mã
            </button>

            <button
              type='button'
              className='btn btn-primary'
              onClick={handleShow}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Modal.Header closeButton>
                <Modal.Title>Xác nhận chuyển tiền</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className='form-row'>
                  <div className='form-group col-sm-12'>
                    <label>Nội dung chuyển tiền</label>
                    <Field
                      name='orderId'
                      type='text'
                      className={
                        'form-control' +
                        (errors.orderId && touched.orderId ? ' is-invalid' : '')
                      }
                    />
                    <ErrorMessage
                      name='orderId'
                      component='div'
                      className='invalid-feedback'
                    />
                  </div>
                </div>

                <div className='form-row'>
                  <div className='form-group col-sm-4'>
                    <label>Số tiền</label>
                    <Field
                      name='amount'
                      as='select'
                      className={
                        'form-control' +
                        (errors.amount && touched.amount ? ' is-invalid' : '')
                      }
                    >
                      <option value=''>Lựa chọn</option>
                      <option value={item?.price}>
                        {item?.price.toLocaleString()}
                      </option>
                    </Field>
                    <ErrorMessage
                      name='amount'
                      component='div'
                      className='invalid-feedback'
                    />
                  </div>
                </div>

                <div className='form-row'>
                  <div className='form-group col-sm-4'>
                    <label>Ngân hàng</label>
                    <Field
                      name='bank'
                      as='select'
                      className={
                        'form-control' +
                        (errors.bank && touched.bank ? ' is-invalid' : '')
                      }
                    >
                      <option value=''>Lựa chọn</option>
                      {fund_transfer?.map((fund) => {
                        return <option value={fund?.bank}>{fund?.bank}</option>
                      })}
                    </Field>
                    <ErrorMessage
                      name='bank'
                      component='div'
                      className='invalid-feedback'
                    />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button className='btn btn-secondary' onClick={handleClose}>
                  Hủy bỏ
                </button>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='btn btn-primary'
                >
                  {isSubmitting && (
                    <span className='spinner-border spinner-border-sm mr-1'></span>
                  )}
                  Xác nhận
                </button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  )
}

export default ItemDeposit
