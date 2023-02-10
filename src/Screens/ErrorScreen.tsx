import type { AppRouter } from "@/server/trpc/router/_app";
import type { TRPCClientErrorLike } from "@trpc/client";

// external imports
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

const ErrorScreen = ({ error }: { error?: TRPCClientErrorLike<AppRouter> }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <ExclamationCircleIcon className="text-danger aspect-square w-24 md:w-28" />
      <h1 className="text-title text-center text-2xl font-bold md:text-3xl">
        {error?.message ?? "Something went wrong"}
      </h1>
      <table>
        <thead className="text-text text-base font-medium md:text-lg">
          <tr>
            <th>Try doing these:</th>
          </tr>
        </thead>
        <tbody className="text-text text-base font-medium md:text-lg">
          <tr>
            <td>1. Spine transfer to nosegrab frontflip</td>
          </tr>
          <tr>
            <td>2. Wall flip to natas spin</td>
          </tr>
          <tr>
            <td>3. Sticker slap to manual to wallplant</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ErrorScreen;
