import Link from "next/link";

const HowItWorksPage = () => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Visual Vibes
          </div>
          <Link
            href="/vibes"
            className="block mt-1 text-lg leading-tight font-medium text-black hover:underline"
          >
            Bring Your Objects to Life
          </Link>
          <p className="mt-2 text-gray-500">
            Transform everyday objects into characters living a human life. Our
            app, Visual Vibes, generates a sequence of images showing your
            character in daily activities – from morning routines to evening
            relaxation.
          </p>

          <h3 className="mt-4 text-lg leading-tight font-medium text-black">
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
              <span className="font-semibold">Explore our gallery </span>
            </Link>
            for inspiration and see how ordinary objects can gain extraordinary
            lives!
          </p>
        </div>
      </div>
      <div class="flex justify-center items-center">
        <Link
          href="/gallery"
          className="bg-indigo-500 text-white font-semibold mb-4 py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
        >
          Go To Gallery
        </Link>
      </div>
    </div>
  );
};

export default HowItWorksPage;
