import { Button, ButtonToolbar, Modal } from 'react-bootstrap'

import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const ModalDeposit = () => {
  const initialValues = {
    orderId: '',
  }

  const validationSchema = Yup.object().shape({
    orderId: Yup.string().required('Nội dung chuyển tiền không được bỏ trống'),
    // amount: Yup.string().required('Số tiền không được để trống'),
  })

  function onSubmit(fields, { setStatus, setSubmitting }) {
    // setStatus()
    // cartService
    //   .confirmDeposit(fields)
    //   .then(() => {
    //     alertService.success(
    //       'Xác nhận chuyển tiền thành công. Vui lòng đợi chúng tôi kiểm tra và phê duyệt.',
    //       { keepAfterRouteChange: true }
    //     )
    //     handleClose()
    //     // history.push('login')
    //   })
    //   .catch((error) => {
    //     setSubmitting(false)
    //     alertService.error(error)
    //   })
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <Modal
            show={show}
            onHide={handleClose}
            aria-labelledby='contained-modal-title-vcenter'
            centered
          >
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

              {/* <div className='form-row'>
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
                      <option value={item?.id}>
                        {item?.price.toLocaleString()}
                      </option>
                    </Field>
                    <ErrorMessage
                      name='amount'
                      component='div'
                      className='invalid-feedback'
                    />
                  </div>
                </div> */}
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
          </Modal>
        </Form>
      )}
    </Formik>
  )
}

export default Modal
