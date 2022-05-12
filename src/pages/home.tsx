import { Link } from 'react-router-dom';
import KanbanBoardImage from '../images/kanban-board.png';

const Home = () => {
  return (
    <section className="flex flex-col lg:flex-row ">
      <div className="flex-1 w-full lg:w-1/2 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
          <div className="sm:text-center lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block text-teal-500 xl:inline">WorkSpace</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              A minimal Kanban board on which you can plan your projects, create
              and view tickets.
            </p>
            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
              <div className="rounded-md shadow">
                <Link
                  to="/boards"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 md:py-4 md:text-lg md:px-10"
                >
                  Get started
                </Link>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Link
                  to="/boards/WKMKhsBtDVbl8SM1A6jW"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-teal-700 bg-gray-200 hover:bg-gray-300 md:py-4 md:text-lg md:px-10"
                >
                  See sample
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      <div className="flex-1 w-full h-full lg:w-1/2 ">
        <img
          src={KanbanBoardImage}
          loading="lazy"
          width="700"
          height="600"
          alt="Kanban board image"
        />
      </div>
    </section>
  );
};

export default Home;
