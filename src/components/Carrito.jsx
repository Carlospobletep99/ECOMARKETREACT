import { Button, Image, ListGroup, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsDash, BsPlus, BsTrash } from 'react-icons/bs';
import { useCarrito } from '../context/CarritoContext.jsx';
import { useInventario } from '../context/InventarioContext.jsx';

export default function Carrito() {
  const {
    cart,
    cartTotal,
    cartItemCount,
    isCartOpen,
    closeCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart
  } = useCarrito();
  const { products } = useInventario();

  return (
    <Offcanvas show={isCartOpen} onHide={closeCart} placement="end" className="cart-offcanvas">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Tu carrito</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column gap-4">
        {cart.length === 0 ? (
          <p className="text-muted mb-0">Tu carrito está vacío. Agrega productos desde el catálogo.</p>
        ) : (
          <>
            <ListGroup variant="flush" className="cart-items-list">
              {cart.map(item => {
                const product = products?.find(prod => prod.codigo === item.codigo);
                const availableStock = product?.cantidad ?? 0;
                const isMaxStock = availableStock !== 0 ? item.cantidad >= availableStock : true;

                return (
                  <ListGroup.Item key={item.codigo} className="cart-item px-0">
                    <div className="d-flex align-items-start gap-3">
                      <Image src={item.imagen} alt={item.nombre} className="cart-item-thumb rounded" />
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{item.nombre}</h6>
                            <p className="mb-0 text-muted small">${item.precio.toLocaleString('es-CL')} c/u</p>
                            <p className="mb-0 text-muted small">
                              Unidad: {item.unidadMedida ?? 'Unidad'}
                            </p>
                            <p className="mb-0 text-muted small">
                              Stock disponible: {availableStock}
                            </p>
                          </div>
                          <Button
                            variant="link"
                            className="text-danger p-0 cart-remove-btn"
                            onClick={() => removeFromCart(item.codigo)}
                          >
                            <BsTrash aria-hidden="true" />
                            <span className="visually-hidden">Eliminar {item.nombre}</span>
                          </Button>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <div className="d-flex align-items-center gap-2">
                            <Button
                              variant="outline-success"
                              size="sm"
                              disabled={item.cantidad === 1}
                              onClick={() => decrementQuantity(item.codigo)}
                            >
                              <BsDash aria-hidden="true" />
                              <span className="visually-hidden">Restar uno</span>
                            </Button>
                            <span className="cart-quantity-value fw-semibold">{item.cantidad}</span>
                            <Button
                              variant="outline-success"
                              size="sm"
                              disabled={isMaxStock}
                              onClick={() => incrementQuantity(item.codigo)}
                            >
                              <BsPlus aria-hidden="true" />
                              <span className="visually-hidden">Sumar uno</span>
                            </Button>
                          </div>
                          <span className="fw-semibold">
                            ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                          </span>
                        </div>
                        {isMaxStock && (
                          <p className="text-danger small mt-2 mb-0">
                            Alcanzaste el stock máximo disponible.
                          </p>
                        )}
                      </div>
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
            <div className="mt-auto pt-3 border-top">
              <div className="d-flex justify-content-between align-items-center fw-semibold mb-3">
                <span>
                  Total ({cartItemCount} {cartItemCount === 1 ? 'producto' : 'productos'})
                </span>
                <span>${cartTotal.toLocaleString('es-CL')}</span>
              </div>
              <div className="d-flex flex-column gap-2">
                <Button as={Link} to="/pedido" variant="success" onClick={closeCart}>
                  Confirmar pedido
                </Button>
              </div>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
