import {
	render,
	screen,
	waitFor,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { act } from 'react-dom/test-utils';
import { useLocation, useParams, MemoryRouter } from 'react-router-dom';
import App from '../components/App/App';
import ErrorPage from '../components/ErrorPage/ErrorPage';
import Header from '../components/Header/Header';
import Home from '../components/Home/Home';
import Shop from '../components/Shop/Shop';
import Loading from '../components/Loading/Loading';
import Card from '../components/Card/Card';
import Cart from '../components/Cart/Cart';
import Router from '../Router';

//🛑
describe('App component', () => {
	it('should render the Header component', () => {
		vi.mock('react-router-dom', async (importOriginal) => {
			const actual = await importOriginal();
			return {
				...actual,
				useLocation: vi.fn(),
				useParams: vi.fn(),
			};
		});
		useLocation.mockReturnValue({ pathname: '/shop' });
		useParams.mockReturnValue({ name: 'shop' });

		act(() => {
			render(
				<MemoryRouter>
					<App />
				</MemoryRouter>
			);
		});

		const header = screen.getByTestId('header');
		expect(header).toBeInTheDocument();

		/* 		useLocation.mockReset();
		useParams.mockReset(); */
	});

	it('it should render the Cart component', () => {
		vi.mock('react-router-dom', async (importOriginal) => {
			const actual = await importOriginal();
			return {
				...actual,
				useLocation: vi.fn(),
				useParams: vi.fn(),
			};
		});

		useLocation.mockReturnValue({ pathname: '/cart' });
		useParams.mockReturnValue({ name: 'cart' });

		render(
			<MemoryRouter>
				<App />
			</MemoryRouter>
		);

		const emptyCart = screen.getByRole('heading', {
			name: 'Your cart is empty. Add some items in the shop. 🛒',
		});

		expect(emptyCart).toBeInTheDocument();

		/* 		useLocation.mockReset();
		useParams.mockReset(); */
	});
});

describe('ErrorPage component', () => {
	it('should render the error message', () => {
		render(
			<MemoryRouter>
				<ErrorPage />
			</MemoryRouter>
		);

		const message = screen.getByText(
			/Oh no, this route doesn't exist or there was a network error encountered./
		);

		expect(message).toBeInTheDocument();
	});
});

describe('Header component', () => {
	it('should render the store name', () => {
		render(
			<MemoryRouter>
				<Header path="/" numberOfItems={0} />
			</MemoryRouter>
		);
		const header = screen.getByRole('heading', { name: 'AwesomeShop' });
		expect(header).toBeInTheDocument();
	});

	describe('Navbar', () => {
		it('should render the navbar', () => {
			render(
				<MemoryRouter>
					<Header path="/" numberOfItems={0} />
				</MemoryRouter>
			);
			const navbar = screen.getByRole('navigation');
			expect(navbar).toBeInTheDocument();
		});

		//🛑
		/* 	it('should open the shop page on a click', async () => {
			const user = userEvent.setup();

			render(
				<Router>
					<Header path="/" numberOfItems={0} />
				</Router>
			);

			const shopLink = await screen.findByTestId('shop-link');
			await user.click(shopLink);
			expect(shopLink).toHaveClass('_activeLink_63c2ea');

			const shop = await screen.findByTestId('shop');
			expect(shop).toBeInTheDocument();
		}); */

		//🛑
		/* 		it('should open the cart page on a click', async () => {
			const user = userEvent.setup();

			render(
				<Router>
					<Header path="/" numberOfItems={0} />
				</Router>
			);

			const cartLink = screen.getByTestId('cart-link');
			await user.click(cartLink);

			const cart = screen.getByRole('heading', {
				name: 'Your cart is empty. Add some items in the shop. 🛒',
			});
			expect(cart).toBeInTheDocument();
		}); */

		it('should render the right number of items', () => {
			render(
				<MemoryRouter>
					<Header path="/" numberOfItems={1} />
				</MemoryRouter>
			);

			const numberOfItems = screen.getByTestId('number-of-items');
			expect(numberOfItems).toHaveTextContent('1');
		});
	});
});

describe('Home component', () => {
	it('should render a welcome heading', () => {
		render(<Home />);
		const welcomeHeading = screen.getByRole('heading', { name: 'Welcome' });
		expect(welcomeHeading).toBeInTheDocument();
	});

	it('should render a welcome message', () => {
		render(<Home />);
		const welcomeMessage = screen.getByText(
			/Discover a world of virtual shopping/
		);
		expect(welcomeMessage).toBeInTheDocument();
	});

	it('should render a credit link', () => {
		render(<Home />);
		const link = screen.getByRole('link', { name: 'Artem Gavrysh' });
		expect(link).toBeInTheDocument();
	});
});

describe('Shop component', () => {
	it('should show the Loading component while API request is in progress', async () => {
		render(
			<MemoryRouter>
				<Shop />
			</MemoryRouter>
		);

		const loading = screen.getByTestId('loading-animation');

		expect(loading).toBeInTheDocument();

		await waitForElementToBeRemoved(() =>
			screen.getByTestId('loading-animation')
		);
	});

	window.fetch = vi.fn(() => {
		const products = [
			{
				category: "men's clothing",
				id: 1,
				image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
				price: 109.95,
				title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
			},
		];

		return Promise.resolve({
			json: () => Promise.resolve(products),
		});
	});

	it('should show the Error component when a request fails', async () => {
		window.fetch.mockImplementationOnce(() => {
			return Promise.reject({ message: 'API is down' });
		});

		render(
			<MemoryRouter>
				<Shop />
			</MemoryRouter>
		);

		const errorMessage = await screen.findByText(
			/Oh no, this route doesn't exist or there was a network error encountered./
		);

		expect(errorMessage).toBeInTheDocument();
	});

	describe('Navbar', () => {
		it('should render the navbar', async () => {
			render(
				<MemoryRouter>
					<Shop />
				</MemoryRouter>
			);

			const navbar = await screen.findByTestId('category-navbar');

			expect(navbar).toBeInTheDocument();
		});

		it('it should switch a category on the click', async () => {
			const user = userEvent.setup();

			render(
				<MemoryRouter>
					<Shop />
				</MemoryRouter>
			);

			const navbarLink = await screen.findByTestId("women's-clothing");

			await user.click(navbarLink);

			expect(navbarLink).toHaveClass('_activeLink_008a62');
		});
	});

	it('should render the Card component', async () => {
		render(
			<MemoryRouter>
				<Shop />
			</MemoryRouter>
		);

		const card = await screen.findByTestId('card');

		expect(card).toBeInTheDocument();
	});
});

describe('Loading component', () => {
	it('should render the loading animation', () => {
		render(<Loading />);

		const animation = screen.getByTestId('loading-animation');

		expect(animation).toBeInTheDocument();
	});
});

describe('Card component', () => {
	const product = {
		category: "men's clothing",
		id: 1,
		image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
		price: 109.95,
		title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
	};

	it('should render a product information', () => {
		render(<Card product={product} />);

		const title = screen.getByRole('heading', {
			name: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
		});
		const price = screen.getByRole('heading', { name: '109.95 $' });

		expect(title).toBeInTheDocument();
		expect(price).toBeInTheDocument();
	});

	describe('Add button', () => {
		it('should render the add button', () => {
			render(<Card product={product} />);

			const button = screen.getByRole('button', { name: 'Add' });

			expect(button).toBeInTheDocument();
		});

		it('should call the onClick function when clicked', async () => {
			const onClick = vi.fn();
			const user = userEvent.setup();

			render(<Card product={product} addItem={onClick} />);

			const button = screen.getByRole('button', { name: 'Add' });

			await user.click(button);

			expect(onClick).toHaveBeenCalled();
		});
	});
});

describe('Cart component', () => {
	it('should render a heading for the empty cart', () => {
		render(<Cart cart={[]} />);

		const heading = screen.getByRole('heading', {
			name: 'Your cart is empty. Add some items in the shop. 🛒',
		});

		expect(heading).toBeInTheDocument();
	});

	const cart = [
		{
			id: 1,
			number: 3,
			product: {
				title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
				price: 109.95,
			},
		},
	];

	it('should render a table when the cart is not empty', () => {
		render(<Cart cart={cart} />);

		const table = screen.getByRole('table');

		expect(table).toBeInTheDocument();
	});

	it('should render a correct total amount', () => {
		render(<Cart cart={cart} />);

		const total = screen.getByTestId('total');

		expect(total).toHaveTextContent(`${109.95 * 3}`);
	});

	describe('Buy button', () => {
		it('should render a modal when clicked', async () => {
			HTMLDialogElement.prototype.showModal = vi.fn(function mock() {
				this.open = true;
			});

			const user = userEvent.setup();

			render(<Cart cart={cart} />);

			const button = screen.getByRole('button', { name: 'Buy' });

			await user.click(button);

			expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();

			const modal = screen.getByRole('dialog');
			expect(modal).toBeVisible();

			const modalHeading = screen.getByRole('heading', {
				name: 'Thank You for Shopping with Us! ❤️',
			});
			expect(modalHeading).toBeVisible();
		});
	});

	describe('Close button', () => {
		it('should close a modal when clicked', async () => {
			HTMLDialogElement.prototype.close = vi.fn(function mock() {
				this.open = false;
			});

			const user = userEvent.setup();

			render(<Cart cart={cart} />);

			const button = screen.getByRole('button', { name: 'Buy' });

			await user.click(button);

			const closeButton = screen.getByLabelText('Close');
			expect(closeButton).toBeVisible();

			await user.click(closeButton);
			expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
		});
	});
});
