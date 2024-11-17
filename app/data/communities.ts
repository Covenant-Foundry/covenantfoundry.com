import christiansInTech from "#app/assets/images/christians-in-tech.jpg";
import faithDrivenEntrepreneur from "#app/assets/images/faith-driven-entrepreneur.webp";
import faithTech from "#app/assets/images/faithtech.png";
import reformedDevs from "#app/assets/images/reformed-devs.png";
import { type Resource } from "#app/components/resources/resource-card";

export const communities: Resource[] = [
  {
    title: "Faith Driven Entrepreneur",
    description:
      "Helping Christ-following entrepreneurs find their community and fulfill their God-given call to create.",
    category: "Entrepreneurship",
    tags: [],
    link: "https://www.faithdrivenentrepreneur.org/",
    imageUrl: faithDrivenEntrepreneur,
  },
  {
    title: "FaithTech",
    description: "Bridging the Gap Between Faith and Technology",
    category: "Tech",
    tags: [],
    link: "https://faithtech.com/",
    imageUrl: faithTech,
  },
  {
    title: "Christians in Tech",
    description: "A Slack community for Christians in tech",
    category: "Tech",
    tags: [],
    link: "https://cit.chat/invitation",
    imageUrl: christiansInTech,
  },
  {
    title: "Reformed Devs",
    description: "A Discord community for Reformed-ish developers",
    category: "Tech",
    tags: [],
    link: "https://discord.gg/fKcJVvjPCq",
    imageUrl: reformedDevs,
  },
];
