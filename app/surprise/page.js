import { headers } from 'next/headers';
import DesktopView from './DesktopView';
import MobileView from './MobileView';

export default function Page() {
  const headersList = headers();
  const userAgent = headersList.get('user-agent') || '';

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  if (isMobile) {
    return <MobileView />;
  }

  return <DesktopView />;
}