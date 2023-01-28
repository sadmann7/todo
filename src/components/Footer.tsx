import dayjs from "dayjs";

const Footer = () => {
  return (
    <footer aria-label="footer" className="w-full py-2">
      <p className="text-center text-sm font-medium text-neutral-300 md:text-base">
        @ {dayjs().format("YYYY")}
      </p>
    </footer>
  );
};

export default Footer;
