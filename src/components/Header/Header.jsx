import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './Header.module.css';

const Header = ({ path, numberOfItems }) => {
	const currentPath = path;

	return (
		<>
			<header data-testid="header" className={styles.header}>
				<h1 className={styles.shopName}>AwesomeShop </h1>

				<nav className={styles.headerLinks}>
					<Link
						to="/"
						className={
							currentPath === '/'
								? styles.activeLink
								: styles.inactiveLink
						}
					>
						Home
					</Link>{' '}
					<Link
						to="/shop"
						data-testid="shop-link"
						className={
							currentPath === '/shop'
								? styles.activeLink
								: styles.inactiveLink
						}
					>
						Shop
					</Link>
					<div className={styles.shoppingCartContainer}>
						<Link
							to="/cart"
							data-testid="cart-link"
							className={
								currentPath === '/cart'
									? styles.activeCartLink
									: styles.inactiveCartLink
							}
						>
							<span
								className={`material-symbols-outlined ${styles.cartIcon}`}
							>
								shopping_cart
							</span>
						</Link>
						<div className={styles.cartItemCount}>
							<span data-testid="number-of-items">
								{numberOfItems}
							</span>
						</div>
					</div>
				</nav>
			</header>
		</>
	);
};

Header.propTypes = {
	path: PropTypes.string.isRequired,
	numberOfItems: PropTypes.number.isRequired,
};

export default Header;
