import { Formik, Form, Field, FormikHelpers, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import cx from 'classnames';
import GoogleIcon from '../assets/icons/google.svg';

interface Values {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter valid email address')
    .required('Required'),
  password: Yup.string().min(8).required('Required'),
});

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 mb-6 sm:text-5xl md:text-6xl">
          <span className="block text-teal-500 xl:inline">WorkSpace</span>
        </h1>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={(
            values: Values,
            { setSubmitting }: FormikHelpers<Values>,
          ) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 500);
          }}
        >
          {({ isSubmitting, isValid, dirty }) => (
            <Form className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
              <h1 className="mb-8 text-3xl text-center">Log in</h1>

              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="block border border-grey-light w-full p-2 rounded mb-4"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="p-4 mt-[-1.5rem] text-sm text-red-700"
              />
              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="block border border-grey-light w-full p-2 rounded mb-4"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="p-4 mt-[-1.5rem] text-sm text-red-700"
              />
              <button
                type="submit"
                disabled={isSubmitting || !(isValid && dirty)}
                className={cx(
                  'w-full font-medium text-center py-2 rounded text-white focus:outline-none my-1',
                  isSubmitting || !(isValid && dirty)
                    ? 'bg-slate-300 hover:bg-slate-700 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700 cursor-pointer',
                )}
              >
                {isSubmitting ? (
                  <span>Logging in...</span>
                ) : (
                  <span>Submit</span>
                )}
              </button>
              <div className="text-center text-sm text-grey-dark my-2">OR </div>

              <button
                type="button"
                className="w-full text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded px-5 py-2.5 flex flex-row place-content-center dark:focus:ring-[#4285F4]/55 my-1"
              >
                <img
                  src={GoogleIcon}
                  className="text-black mr-2"
                  width="20"
                  height="20"
                  alt="google icon"
                />
                Continue with Google
              </button>
            </Form>
          )}
        </Formik>
        <div className="text-grey-dark mt-6">
          Don&apos;t have an account?{' '}
          <a
            className="no-underline border-b border-blue text-blue"
            href="../login/"
          >
            Sign up
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default Login;
