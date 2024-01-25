import PropTypes from 'prop-types';
import styles from './Cart.module.css';

const Cart = ({ cart }) => {
	const total = cart.reduce(
		(accumulator, product) =>
			accumulator +
			Number(product.number) * Number(product.product.price),
		0
	);

	if (cart.length === 0) {
		return (
			<div className={styles.cartContainer}>
				<h1>Your cart is empty. Add some items in the shop. 🛒</h1>

				<a href="https://github.com/Haminimi" className={styles.link}>
					<i
						className={`devicon-github-original ${styles.gitHubIcon}`}
					></i>
				</a>
			</div>
		);
	}

	function openModal() {
		const modal = document.querySelector('dialog');
		modal.showModal();
	}

	function closeModal() {
		const modal = document.querySelector('dialog');
		modal.close();
	}

	return (
		<div className={styles.cartContainer}>
			<table>
				<caption className={styles.caption}>
					<h2>Shopping Cart</h2>
				</caption>
				<thead>
					<tr>
						<th scope="col">Item</th>
						<th scope="col">Price</th>
						<th scope="col">Quantity</th>
						<th scope="col">Total per item</th>
					</tr>
				</thead>
				<tbody>
					{cart.map((product) => {
						return (
							<tr key={product.id}>
								<td>{product.product.title}</td>
								<td>{product.product.price} $</td>
								<td>{product.number}</td>
								<td>
									{Number(product.number) *
										Number(product.product.price)}{' '}
									$
								</td>
							</tr>
						);
					})}
					<tr>
						<th colSpan={3} scope="row">
							Total
						</th>
						<td className={styles.total}>
							<b>{Number(total.toFixed(2))} $</b>
						</td>
					</tr>
				</tbody>
			</table>

			<div className={styles.iconAndButton}>
				<a href="https://github.com/Haminimi" className={styles.link}>
					<i
						className={`devicon-github-original ${styles.gitHubIcon}`}
					></i>
				</a>
				<button onClick={openModal} className={styles.button}>
					Buy
				</button>
			</div>

			<dialog className={styles.modal}>
				<div className={styles.modalContent}>
					<h2>Thank You for Shopping with Us! ❤️</h2>
					<p>
						We express our sincere gratitude for choosing
						AwesomeShop for your recent shopping spree! Your support
						means the world to us, and we hope you found everything
						you were looking for.
					</p>
					<span
						onClick={closeModal}
						onKeyDown={closeModal}
						tabIndex={0}
						className={`material-symbols-outlined ${styles.closeIcon}`}
					>
						close
					</span>
				</div>
			</dialog>
		</div>
	);
};

Cart.propTypes = {
	cart: PropTypes.array.isRequired,
};

export default Cart;
