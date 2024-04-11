import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { isAuthenticated } from '@/lib/authenticate';
import { favouritesAtom, searchHistoryAtom } from '@/store';
import { getFavourites, getHistory } from '@/lib/userData';

const PUBLIC_PATHS = ['/login', '/', '/_error', '/register', '/search'];

export default function RouteGuard(props) {
  const router = useRouter();
  const [, setFavouritesList] = useAtom(favouritesAtom);
  const [, setSearchHistory] = useAtom(searchHistoryAtom);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const updateAtoms = async () => {
      setFavouritesList(await getFavourites());
      setSearchHistory(await getHistory());
    };

    const authCheck = async (url) => {
      const path = url.split('?')[0];
      if (!PUBLIC_PATHS.includes(path) && !isAuthenticated()) {
        setAuthorized(false);
        router.push('/login');
      } else {
        setAuthorized(true);
        await updateAtoms();
      }
    };

    // on initial load - run auth check
    authCheck(router.pathname);

    // on route change complete - run auth check
    router.events.on('routeChangeComplete', authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []);

  return <>{authorized && props.children}</>
}
