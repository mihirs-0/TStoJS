import { redirect, RedirectType } from 'next/navigation';

export default function Page() {
  redirect('/home', RedirectType.replace);
}
