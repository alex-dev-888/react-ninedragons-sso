import React, { useState, useEffect, useRef } from 'react'
import NumberFormat from 'react-number-format'

import { cartService } from '@/_services'

import { toast } from 'react-toastify'

import config from 'config'

const KTCItem = ({ item, user, history, setCoin }) => {
  const [isProcess, setIsProcess] = useState(false)

  const refContainer = useRef(null)

  const [show, setShow] = useState(false)

  const purchased = (id, price, name, type) => {
    if (confirm('Bạn có chắc muốn mua?')) {
      if (parseInt(user.coin) < parseInt(price)) {
        toast.error('Bạn không đủ xu để giao dịch, vui lòng nạp thêm', {
          autoClose: 3000,
        })
      } else {
        if (type === 'CS' && refContainer?.current?.value === '') {
          toast.error('Vui lòng nhập chính xác tên nhân vật chuyển sinh.', {
            autoClose: 3000,
          })
        } else {
          setIsProcess(true)
          const fields = {
            orderId: id.toString(),
            userId: user.id,
            amount: price,
            orderName: name,
            type: type == null ? '' : type,
            chr_name: refContainer?.current?.value,
          }

          cartService
            .purchase(fields)
            .then(() => {
              if (type === 'CS') {
                toast.success(
                  'Bạn đã chuyển sinh thành công. Vui lòng đợi 30p mới được đăng nhập.',
                  { autoClose: 3000 }
                )
                setCoin((coin) => coin - parseInt(price))
              } else {
                toast.success('Cảm ơn bạn đã mua vật phẩm', { autoClose: 3000 })
                setCoin((coin) => coin - parseInt(price))
              }
              setIsProcess(false)
            })
            .catch((error) => {
              setIsProcess(false)
              toast.error(error, { autoClose: 3000 })
            })
        }
      }
    }
  }

  return (
    <>
      {/* <div className='col-sm-12 col-md-6 mb-3'> */}
      <div className='col-sm-12 mb-2 col-md-6'>
        <div className='card'>
          <div
            className='card-header d-flex align-items-center'
            style={{ cursor: 'pointer' }}
            onClick={() => setShow(!show)}
          >
            {item?.deco !== 1 && (
              <div className='flex-shrink-0 mr-2'>
                <img src={`${config.apiUrl}/images/${item?.image}`} />
              </div>
            )}
            <div className='flex-grow-1 ms-3'>
              {item?.name} -{' '}
              <NumberFormat
                value={item?.price}
                displayType={'text'}
                thousandSeparator={true}
                suffix={' coin'}
              />
            </div>
          </div>
          {show && (
            <div className='card-body'>
              <pre>{item?.desc}</pre>

              {item?.deco === 1 && (
                <>
                  <img
                    src={`${config.apiUrl}/images/${item?.image}`}
                    width='100px'
                  />
                  <br />
                  <br />
                </>
              )}

              {item?.type === 'CS' && (
                <div className='form-row'>
                  <div className='form-group col-sm-12'>
                    <p className='text-danger'>
                      Cung cấp chính xác tên nhân vật cần chuyển sinh
                      <br />
                      Vui lòng thoát game trước khi chuyển sinh và không đăng
                      nhập ít nhất 30 phút.
                      <br />
                      Chúng tôi không chịu trách nhiệm trong trường hợp bạn cung
                      cấp sai tên nhân vật hoặc nhân vật không đạt đủ level yêu
                      cầu
                      <br />
                    </p>

                    <label>Tên nhân vật chuyển sinh</label>
                    <input
                      type='text'
                      ref={refContainer}
                      className='form-control'
                    />
                  </div>
                </div>
              )}

              <button
                type='button'
                className='btn btn-primary mr-3'
                onClick={() =>
                  purchased(item?.id, item?.price, item?.name, item?.type)
                }
              >
                {isProcess ? (
                  <span className='spinner-border spinner-border-sm'></span>
                ) : (
                  <span>Mua</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* <Modal
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
      </Modal> */}
    </>
  )
}

export default KTCItem
