import Link from "next/link";

const HowItWorksPage = () => {
  return (
    <div className="mt-20 mx-auto rounded-xl shadow-md overflow-hidden md:max-w-2xl bg-gray-900 p-3">
      <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-xl shadow-md overflow-hidden md:max-w-2xl space-y-4">
        <div className="md:flex">
          <div className="text-gray-300">
            <div className="uppercase tracking-wide text-sm text-purple-400 font-semibold">
              Visual Vibes
            </div>
            <Link
              href="/vibes"
              className="block mt-1 text-lg leading-tight font-medium text-gray-300 hover:underline hover:text-purple-500"
            >
              Bring Your Objects to Life
            </Link>
            <p className="mt-2 text-gray-500">
              Transform everyday objects into characters living a human life. Our
              app, Visual Vibes, generates a sequence of images showing your
              character in daily activities – from morning routines to evening
              relaxation.
            </p>

            <h3 className="mt-4 text-lg leading-tight font-medium text-gray-300">
              How to Use:
            </h3>
            <ol className="list-decimal ml-5 mt-2 text-gray-600">
              <li>Upload an image of your choice.</li>
              <li>Enter your OpenAI API Key.</li>
              <li>Wait for the image generation.</li>
              <li>Use or share your unique images.</li>
            </ol>

            <p className="mt-3">
              <Link href="/gallery">
                <span className="font-semibold text-purple-400 hover:text-purple-500">Explore our gallery </span>
              </Link>
              for inspiration and see how ordinary objects can gain extraordinary
              lives!
            </p>
          </div>
        </div>
        <div className="flex flex-row space-x-2 justify-center items-center">
          <Link
            href="/gallery"
            className="bg-purple-500 text-white font-semibold mb-4 py-2 px-4 rounded hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-300 focus:ring-opacity-50"
          >
            Go To Gallery
          </Link>
          <Link
            href="/vibes"
            className="bg-purple-500 text-white font-semibold mb-4 py-2 px-4 rounded hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-300 focus:ring-opacity-50"
          >
            Make Some Vibes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
