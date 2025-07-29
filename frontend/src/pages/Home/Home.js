import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  CodeBracketIcon, 
  TrophyIcon, 
  ChartBarIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Coding Problems',
    description: 'Solve challenging programming problems across different difficulty levels.',
    icon: CodeBracketIcon,
  },
  {
    name: 'Real-time Judging',
    description: 'Get instant feedback on your code submissions with detailed test results.',
    icon: ChartBarIcon,
  },
  {
    name: 'Leaderboard',
    description: 'Compete with other programmers and track your progress on the global leaderboard.',
    icon: TrophyIcon,
  },
  {
    name: 'Community',
    description: 'Join a community of passionate programmers and learn from each other.',
    icon: UserGroupIcon,
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 h-full w-full" aria-hidden="true">
          <div className="relative h-full">
            <svg
              className="absolute right-full transform translate-y-1/3 translate-x-1/4 md:translate-y-1/2 sm:translate-x-1/2 lg:translate-x-full"
              width={404}
              height={784}
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="e229dbec-10e9-49ee-8ec3-0286ca089edf"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width={404} height={784} fill="url(#e229dbec-10e9-49ee-8ec3-0286ca089edf)" />
            </svg>
          </div>
        </div>

        <div className="relative pt-6 pb-16 sm:pb-24">
          <main className="mt-16 sm:mt-24">
            <div className="mx-auto max-w-7xl">
              <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center">
                  <div>
                    <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-gray-900 sm:mt-5 sm:leading-none lg:mt-6 lg:text-5xl xl:text-6xl">
                      <span className="md:block">Master</span>{' '}
                      <span className="text-primary-600 md:block">Programming</span>{' '}
                      <span className="md:block">Skills</span>
                    </h1>
                    <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                      Challenge yourself with coding problems, compete with others, and improve your programming skills on our online judge platform.
                    </p>
                    <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
                      {isAuthenticated ? (
                        <div className="rounded-md shadow">
                          <Link
                            to="/problems"
                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                          >
                            Start Solving
                          </Link>
                        </div>
                      ) : (
                        <>
                          <div className="rounded-md shadow">
                            <Link
                              to="/register"
                              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                            >
                              Get started
                            </Link>
                          </div>
                          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                            <Link
                              to="/problems"
                              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                            >
                              Browse Problems
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6">
                  <div className="bg-white sm:max-w-md sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden">
                    <div className="px-4 py-8 sm:px-10">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">Quick Stats</span>
                        </div>
                      </div>
                      <div className="mt-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary-600">500+</div>
                            <div className="text-sm text-gray-500">Problems</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary-600">10K+</div>
                            <div className="text-sm text-gray-500">Users</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary-600">50K+</div>
                            <div className="text-sm text-gray-500">Submissions</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary-600">24/7</div>
                            <div className="text-sm text-gray-500">Available</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 bg-gray-50 overflow-hidden lg:py-24">
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
          <div className="relative">
            <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to excel
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
              Our platform provides all the tools and resources you need to improve your programming skills and succeed in coding interviews.
            </p>
          </div>

          <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="relative">
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                Why choose OnlineJudge?
              </h3>
              <p className="mt-3 text-lg text-gray-500">
                We provide a comprehensive platform for competitive programming and interview preparation with features designed to help you succeed.
              </p>

              <dl className="mt-10 space-y-10">
                {features.map((feature) => (
                  <div key={feature.name} className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-10 -mx-4 relative lg:mt-0" aria-hidden="true">
              <div className="relative bg-gray-800 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="font-mono text-sm text-green-400">
                  <div className="mb-2">
                    <span className="text-blue-400">function</span>{' '}
                    <span className="text-yellow-300">twoSum</span>
                    <span className="text-white">(nums, target) {'{'}</span>
                  </div>
                  <div className="mb-2 ml-4">
                    <span className="text-purple-400">const</span>{' '}
                    <span className="text-white">map = </span>
                    <span className="text-blue-400">new Map</span>
                    <span className="text-white">();</span>
                  </div>
                  <div className="mb-2 ml-4">
                    <span className="text-purple-400">for</span>
                    <span className="text-white"> (</span>
                    <span className="text-purple-400">let</span>
                    <span className="text-white"> i = 0; i {'<'} nums.length; i++) {'{'}</span>
                  </div>
                  <div className="mb-2 ml-8">
                    <span className="text-purple-400">const</span>
                    <span className="text-white"> complement = target - nums[i];</span>
                  </div>
                  <div className="mb-2 ml-8">
                    <span className="text-purple-400">if</span>
                    <span className="text-white"> (map.has(complement)) {'{'}</span>
                  </div>
                  <div className="mb-2 ml-12">
                    <span className="text-purple-400">return</span>
                    <span className="text-white"> [map.get(complement), i];</span>
                  </div>
                  <div className="mb-2 ml-8">
                    <span className="text-white">{'}'}</span>
                  </div>
                  <div className="mb-2 ml-8">
                    <span className="text-white">map.set(nums[i], i);</span>
                  </div>
                  <div className="mb-2 ml-4">
                    <span className="text-white">{'}'}</span>
                  </div>
                  <div>
                    <span className="text-white">{'}'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            Join thousands of programmers improving their skills every day.
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto"
            >
              Sign up for free
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}