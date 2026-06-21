import { Link, useLocation } from 'react-router-dom'

const getLinkClassName = (pathname, targetPath) =>
  pathname === targetPath
    ? 'text-sm font-medium text-brand'
    : 'text-sm text-black/60 transition hover:text-black'

function AccountSidebar() {
  const location = useLocation()

  return (
    <aside className="space-y-8">
      <div>
        <h2 className="text-base font-medium text-black">Manage My Account</h2>
        <div className="mt-4 space-y-3 pl-4">
          <Link className={getLinkClassName(location.pathname, '/account')} to="/account">
            My Profile
          </Link>
          <p className="text-sm text-black/40">Address Book</p>
          <p className="text-sm text-black/40">My Payment Options</p>
        </div>
      </div>

      <div>
        <h2 className="text-base font-medium text-black">My Orders</h2>
        <div className="mt-4 space-y-3 pl-4">
          <Link className={getLinkClassName(location.pathname, '/orders')} to="/orders">
            My Orders
          </Link>
          <Link className={getLinkClassName(location.pathname, '/cancellations')} to="/cancellations">
            My Cancellations
          </Link>
        </div>
      </div>

      <div>
        <Link className={getLinkClassName(location.pathname, '/wishlist')} to="/wishlist">
          My Wishlist
        </Link>
      </div>
    </aside>
  )
}

export default AccountSidebar
