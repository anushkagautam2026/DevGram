export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font font-semibold text-center my-7'>
          About DevGram
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
              Welcome to DevGram, a space where knowledge meets innovation!
              At DevGram, we believe in the power of shared learning. 
              This platform is designed for developers, tech enthusiasts,
               and curious minds who are always looking for valuable resources, 
               insightful articles, and useful content to enhance their skills.
            </p>

            <p>
              What You'll Find Here
            🚀 Curated Tech Blogs – Articles covering the latest trends in software development, web technologies, and best practices.
            📖 Informative Guides – Step-by-step tutorials and deep dives into tools, frameworks, and coding challenges.
            🎯 Practical Insights – Real-world applications, problem-solving approaches, and case studies to help you grow as a developer.
            </p>

            <p>
            Why DevGram?
            I created DevGram as a personal hub to document and share the most useful resources
            I come across in my tech journey. Whether you're a beginner or an experienced developer,
             you'll find content that adds value to your learning.
            Join me in exploring the world of technology—one blog at a time! 🚀
            Stay curious. Keep building.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}