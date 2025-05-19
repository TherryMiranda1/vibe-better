import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col w-full justify-between items-center lg:flex-row min-h-screen">
      {/* Columna del formulario */}
      <div className="flex flex-col justify-center items-center w-full max-w-md mx-auto px-8 lg:w-1/2 py-8 lg:h-screen">
        <article className="flex flex-col justify-between max-w-xl mx-auto">
          <div className="border rounded-xl overflow-hidden border-primary/50">
            <SignUp />
          </div>
        </article>
      </div>

      {/* Columna de imagen y texto - visible solo en pantallas grandes */}
      <div className="hidden lg:block h-screen w-1/2 relative overflow-hidden">
        <img
          src={
            "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1747422948/banner_1_efxc9n.jpg"
          }
          alt="10xDev Hero"
          className="object-cover w-full h-full"
        />

        <div className="absolute inset-0 z-10 flex flex-col justify-end items-start w-full">
          <div
            className="bg-gradient-to-t from-black/90 to-black/50 text-foreground p-8 w-full animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <p
              className="text-xl font-bold md:text-2xl animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              Optimize your prompts in seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
