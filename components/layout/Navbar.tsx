"use client";

import Container from "@/components/layout/Container";
import Logo from "@/components/ui/Logo";

import {
  ShoppingBag,
  Search,
  User,
} from "lucide-react";

import { motion } from "framer-motion";

const navLinks = [
  "Home",
  "Shop",
  "Collections",
  "About",
  "Contact",
];

export default function Navbar() {
  return (
    <header
      className="
        sticky
        top-0
        z-[1000]
        w-full
        h-[80px]

        bg-[#05020c]/82
        backdrop-blur-[18px]
        -webkit-backdrop-blur-[18px]

        border-b
        border-white/[0.08]
      "
    >
      
      <Container className="relative z-10">
        <div
        className="
          flex
          h-[80px]
          min-h-[80px]
          items-center
          justify-between
        "
      >

          {/* =================================================
              LOGO
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Logo />
          </motion.div>


          {/* =================================================
              NAVIGATION
          ================================================= */}

          <motion.nav
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.25,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              hidden
              items-center
              gap-8
              md:flex
              lg:gap-10
            "
          >

            {navLinks.map((item) => (
              <a
                key={item}
                href="#"
                className="
                  group
                  relative
                  whitespace-nowrap
                  py-2
                  text-sm
                  font-medium
                  text-white/70
                  transition-colors
                  duration-300
                  hover:text-white
                  lg:text-[15px]
                "
              >
                {item}

                {/* Underline */}
                <span
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-[1.5px]
                    w-0
                    rounded-full
                    bg-violet-500
                    transition-all
                    duration-300
                    group-hover:w-full
                  "
                />
              </a>
            ))}

          </motion.nav>


          {/* =================================================
              ACTIONS
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.35,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              flex
              items-center
              gap-1
              sm:gap-2
            "
          >

            {/* Search */}

            <button
              type="button"
              aria-label="Search"
              className="
                group
                rounded-full
                p-2.5
                text-white/65
                transition-all
                duration-300
                hover:bg-white/[0.07]
                hover:text-white
              "
            >
              <Search
                size={20}
                strokeWidth={1.7}
                className="
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              />
            </button>


            {/* Shopping bag */}

            <button
              type="button"
              aria-label="Shopping bag"
              className="
                group
                rounded-full
                p-2.5
                text-white/65
                transition-all
                duration-300
                hover:bg-white/[0.07]
                hover:text-white
              "
            >
              <ShoppingBag
                size={20}
                strokeWidth={1.7}
                className="
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              />
            </button>


            {/* Account */}

            <button
              type="button"
              aria-label="Account"
              className="
                group
                hidden
                rounded-full
                p-2.5
                text-white/65
                transition-all
                duration-300
                hover:bg-white/[0.07]
                hover:text-white
                sm:block
              "
            >
              <User
                size={20}
                strokeWidth={1.7}
                className="
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              />
            </button>

          </motion.div>

        </div>
      </Container>
    </header>
  );
}