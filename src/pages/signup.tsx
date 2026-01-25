import type { GetStaticProps } from 'next';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from './_app';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { PrimaryLayout } from '@/layouts';
import { useState } from 'react';
import { api } from '@/utils/api';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
};

const Signup: NextPageWithLayout = () => {
  const router = useRouter();
  const { t } = useTranslation('header');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const registerMutation = api.user.register.useMutation({
    onSuccess: () => {
      router.push('/signin');
    },
    onError: (e) => {
      setError(e.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    registerMutation.mutate(formData);
  };

  return (
    <div className="mt-20 flex justify-center px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center text-base shadow-sm">
        <h3 className="mb-6 text-xl font-semibold leading-6 text-gray-900">
          {t('auth.signup')}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          {error && (
            <div className="rounded bg-red-50 p-3 text-sm text-red-500">
              {error}
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {t('auth.name')}
            </label>
            <input
              type="text"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
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
            disabled={registerMutation.isLoading}
            className="mt-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {registerMutation.isLoading ? t('auth.creating_account') : t('auth.create_account')}
          </button>
        </form>
        <div className="mt-6 text-sm text-gray-600">
          {t('auth.already_have_account')}{' '}
          <Link href="/signin" className="text-blue-600 hover:underline">
            {t('auth.signin')}
          </Link>
        </div>
      </div>
    </div>
  );
};

Signup.getLayout = function getLayout(page: ReactElement) {
  return (
    <PrimaryLayout
      seo={{
        title: 'Sign up',
        description: 'Sign up',
        canonical: 'https://karashop.vercel.app/signup',
      }}
    >
      {page}
    </PrimaryLayout>
  );
};

export default Signup;
