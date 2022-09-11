import { container } from "tsyringe";

import { IDateProvider } from "./dateProvider/IDateProvider";
import { DayJSDateProvider } from "./dateProvider/implementations/DayJSDateProvider";

container.registerSingleton<IDateProvider> (
    "DateProvider",
    DayJSDateProvider
);