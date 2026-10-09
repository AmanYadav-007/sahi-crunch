import { useEffect } from 'react';
import { useApp } from './store';
import BottomNav from './BottomNav';
import Splash from './screens/Splash';
import LocationPick from './screens/LocationPick';
import Home from './screens/Home';
import MenuScreen from './screens/MenuScreen';
import Orders from './screens/Orders';
import Reservations from './screens/Reservations';
import Profile from './screens/Profile';
import DishDetail from './screens/DishDetail';
import Checkout from './screens/Checkout';
import TrackOrder from './screens/TrackOrder';
import ReserveFlow from './screens/ReserveFlow';
import Loyalty from './screens/Loyalty';
import Offers from './screens/Offers';
import Search from './screens/Search';
import CartSheet from './screens/CartSheet';

export default function App() {
  const phase = useApp((s) => s.phase);
  const tab = useApp((s) => s.tab);
  const stack = useApp((s) => s.stack);
  const online = useApp((s) => s.online);
  const setOnline = useApp((s) => s.setOnline);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    setOnline(navigator.onLine);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, [setOnline]);

  const top = stack[stack.length - 1];

  const renderStack = () => {
    if (!top) return null;
    switch (top.type) {
      case 'dish':
        return <DishDetail id={top.id} />;
      case 'checkout':
        return <Checkout />;
      case 'track':
        return <TrackOrder orderId={top.orderId} />;
      case 'reserve':
        return <ReserveFlow />;
      case 'loyalty':
        return <Loyalty />;
      case 'offers':
        return <Offers />;
      case 'search':
        return <Search />;
      case 'location':
        return <LocationPick />;
      default:
        return null;
    }
  };

  const renderTab = () => {
    switch (tab) {
      case 'home':
        return <Home />;
      case 'menu':
        return <MenuScreen />;
      case 'orders':
        return <Orders />;
      case 'reservations':
        return <Reservations />;
      case 'profile':
        return <Profile />;
      default:
        return null;
    }
  };

  let content: React.ReactNode;
  if (phase === 'splash') content = <Splash />;
  else if (phase === 'location') content = <LocationPick firstTime />;
  else
    content = (
      <>
        {stack.length === 0 ? (
          <div key={tab} className="screen-in">
            {renderTab()}
          </div>
        ) : (
          renderStack()
        )}
        <BottomNav />
        <CartSheet />
      </>
    );

  return (
    <div className="app-frame">
      {content}

      {!online && phase === 'app' && (
        <div className="fixed inset-x-0 top-0 z-50 mx-auto max-w-[480px] bg-chili px-4 py-2 text-center">
          <span className="label text-ivory">YOU’RE OFFLINE — SHOWING WHAT WE CACHED</span>
        </div>
      )}
    </div>
  );
}
