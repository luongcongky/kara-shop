import type { GetStaticProps } from 'next';
import type { ReactElement } from 'react';
import { useState } from 'react';
import type { NextPageWithLayout } from './_app';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { PrimaryLayout } from '@/layouts';
import { signIn } from 'next-auth/react';
import { useTranslation, Trans } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { getCloudinaryUrl } from '@/utils/cloudinary';
import { useRouter } from 'next/router';

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
};
const Signin: NextPageWithLayout = () => {
  const { t } = useTranslation('header');
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
      callbackUrl: '/',
    });
    if (res?.error) {
      setError(t('auth.invalid_credentials'));
    } else if (res?.url) {
      router.push(res.url);
    }
  };

  return (
    <div className="mt-20 flex justify-center px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center text-base">
        <h3 className="mb-6 text-xl font-semibold leading-6 text-gray-900">
          {t('auth.signin')}
        </h3>
        <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-4 text-left">
          {error && (
            <div className="rounded bg-red-50 p-3 text-sm text-red-500">
              {error}
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {t('auth.email')}
            </label>
            <input
              type="email"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {t('auth.password')}
            </label>
            <input
              type="password"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            {t('auth.signin_with_email')}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">{t('auth.or_continue_with')}</span>
          </div>
        </div>
        <button
          type="button"
          className="my-1.5 flex w-full items-center justify-center gap-3 rounded-md border border-solid border-zinc-400 bg-white px-4 py-2 font-medium transition hover:bg-zinc-100"
          onClick={() => signIn('google', { callbackUrl: '/' })}
        >
          <Image
            src={getCloudinaryUrl('/assets/google.svg')}
            alt="continue with google"
            width="20"
            height="20"
          />
          {t('auth.google')}
        </button>
        <p className="mt-6 text-xs font-normal">
          {t('auth.dont_have_account')}{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            {t('auth.signup')}
          </Link>
        </p>
        <p className="mt-4 text-xs font-normal">
          <Trans i18nKey="auth.terms_privacy" t={t}>
            By signing in, you agree to our <Link href="terms-service" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
          </Trans>
        </p>
      </div>
    </div>
  );
};

Signin.getLayout = function getLayout(page: ReactElement) {
  return (
    <PrimaryLayout
      seo={{
        title: 'Sign in',
        description: 'Sign in',
        canonical: 'https://karashop.vercel.app/signin',
      }}
    >
      {page}
    </PrimaryLayout>
  );
};

export default Signin;
