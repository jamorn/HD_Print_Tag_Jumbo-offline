# Text color variables
@import "tailwindcss";

@plugin "flowbite/plugin";
@source "../node_modules/flowbite";

@theme {
    /* main text color */
    --color-body: var(--color-stone-600);
    --color-body-subtle: var(--color-stone-500);

    /* text heading colors */
    --color-heading: var(--color-stone-900);

    /* used for custom brand colors */
    --color-fg-brand-subtle: var(--color-stone-200);
    --color-fg-brand: var(--color-stone-950);
    --color-fg-brand-strong: var(--color-stone-900);

    /* used for status colors */
    --color-fg-success: var(--color-green-700);
    --color-fg-success-strong: var(--color-green-900);
    --color-fg-danger: var(--color-red-700);
    --color-fg-danger-strong: var(--color-red-900);
    --color-fg-warning-subtle: var(--color-orange-600);
    --color-fg-warning: var(--color-orange-900);
    --color-fg-yellow: var(--color-yellow-400);
    --color-fg-disabled: var(--color-stone-400);
    --color-fg-purple: var(--color-purple-600);
    --color-fg-cyan: var(--color-cyan-600);
    --color-fg-indigo: var(--color-indigo-600);
    --color-fg-pink: var(--color-pink-600);
    --color-fg-lime: var(--color-lime-600);
}
# Background color variables
@import "tailwindcss";

@plugin "flowbite/plugin";
@source "../node_modules/flowbite";

@theme {
    /* BACKGROUND COLOR VARIABLES */
    /* used for neutral colors */
    --color-neutral-primary-soft: var(--color-white);
    --color-neutral-primary: var(--color-white);
    --color-neutral-primary-medium: var(--color-white);
    --color-neutral-primary-strong: var(--color-white);
    --color-neutral-secondary-soft: var(--color-gray-50);
    --color-neutral-secondary: var(--color-gray-50);
    --color-neutral-secondary-medium: var(--color-gray-50);
    --color-neutral-secondary-strong: var(--color-gray-50);
    --color-neutral-secondary-strongest: var(--color-gray-50);
    --color-neutral-tertiary-soft: var(--color-gray-100);
    --color-neutral-tertiary: var(--color-gray-100);
    --color-neutral-tertiary-medium: var(--color-gray-100);
    --color-neutral-quaternary: var(--color-gray-200);
    --color-neutral-quaternary-medium: var(--color-gray-200);
    --color-gray: var(--color-gray-300);

    /* used for brand colors */
    --color-brand-softer: var(--color-blue-50);
    --color-brand-soft: var(--color-blue-100);
    --color-brand: var(--color-blue-700);
    --color-brand-medium: var(--color-blue-200);
    --color-brand-strong: var(--color-blue-800);

    /* used for status colors */
    --color-success-soft: var(--color-emerald-50);
    --color-success: var(--color-emerald-700);
    --color-success-medium: var(--color-emerald-100);
    --color-success-strong: var(--color-emerald-800);
    --color-danger-soft: var(--color-rose-50);
    --color-danger: var(--color-rose-700);
    --color-danger-medium: var(--color-rose-100);
    --color-danger-strong: var(--color-rose-800);
    --color-warning-soft: var(--color-orange-50);
    --color-warning: var(--color-orange-500);
    --color-warning-medium: var(--color-orange-100);
    --color-warning-strong: var(--color-orange-700);
    --color-dark-soft: var(--color-gray-800);
    --color-dark: var(--color-gray-800);
    --color-dark-strong: var(--color-gray-900);
    --color-disabled: var(--color-gray-100);
    --color-purple: var(--color-purple-500);
    --color-sky: var(--color-sky-500);
    --color-teal: var(--color-teal-600);
    --color-pink: var(--color-pink-600);
    --color-cyan: var(--color-cyan-500);
    --color-fuchsia: var(--color-fuchsia-600);
    --color-indigo: var(--color-indigo-600);
    --color-orange: var(--color-orange-400);
}
# Border color variables
@import "tailwindcss";

@plugin "flowbite/plugin";
@source "../node_modules/flowbite";

@theme {
    /* BORDER COLOR VARIABLES */
    --color-buffer: var(--color-white);
    --color-buffer-medium: var(--color-white);
    --color-buffer-strong: var(--color-white);
    --color-muted: var(--color-gray-50);
    --color-light-subtle: var(--color-gray-100);
    --color-light: var(--color-gray-100);
    --color-light-medium: var(--color-gray-100);
    --color-default-subtle: var(--color-gray-200);
    --color-default: var(--color-gray-200);
    --color-default-medium: var(--color-gray-200);
    --color-default-strong: var(--color-gray-200);

    /* used for status colors */
    --color-success-subtle: var(--color-emerald-200);
    --color-danger-subtle: var(--color-rose-200);
    --color-warning-subtle: var(--color-orange-200);
    --color-brand-subtle: var(--color-blue-200);
    --color-brand-light: var(--color-blue-600);
    --color-dark-subtle: var(--color-gray-800);
    --color-dark-backdrop: var(--color-gray-950);
}
# Font family variables
@import "tailwindcss";

@plugin "flowbite/plugin";
@source "../node_modules/flowbite";

@theme {
    --font-sans: 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    --font-body: 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    --font-mono: 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace';
}
# Border radius variables
@import "tailwindcss";

@plugin "flowbite/plugin";
@source "../node_modules/flowbite";

@theme {
    /* BORDER RADIUS VARIABLES */
    --radius-0: 0px;
    --radius-xxs: 2px;
    --radius-xs: 4px;
    --radius-sm: 6px;
    --radius: 8px;
    --radius-base: 12px;
    --radius-lg: 16px;
}
# Default color palette
/* input.css file */

Gray
colors.coolGray
50
#F9FAFB
100
#F3F4F6
200
#E5E7EB
300
#D1D5DB
400
#9CA3AF
500
#6B7280
600
#4B5563
700
#374151
800
#1F2937
900
#111827
Red
colors.red
50
#FDF2F2
100
#FDE8E8
200
#FBD5D5
300
#F8B4B4
400
#F98080
500
#F05252
600
#E02424
700
#C81E1E
800
#9B1C1C
900
#771D1D
Yellow
colors.amber
50
#FDFDEA
100
#FDF6B2
200
#FCE96A
300
#FACA15
400
#E3A008
500
#C27803
600
#9F580A
700
#8E4B10
800
#723B13
900
#633112
Green
colors.emerald
50
#F3FAF7
100
#DEF7EC
200
#BCF0DA
300
#84E1BC
400
#31C48D
500
#0E9F6E
600
#057A55
700
#046C4E
800
#03543F
900
#014737
Blue
colors.blue
50
#EBF5FF
100
#E1EFFE
200
#C3DDFD
300
#A4CAFE
400
#76A9FA
500
#3F83F8
600
#1C64F2
700
#1A56DB
800
#1E429F
900
#233876
Indigo
colors.indigo
50
#F0F5FF
100
#E5EDFF
200
#CDDBFE
300
#B4C6FC
400
#8DA2FB
500
#6875F5
600
#5850EC
700
#5145CD
800
#42389D
900
#362F78
Purple
colors.violet
50
#F6F5FF
100
#EDEBFE
200
#DCD7FE
300
#CABFFD
400
#AC94FA
500
#9061F9
600
#7E3AF2
700
#6C2BD9
800
#5521B5
900
#4A1D96
Pink
colors.pink
50
#FDF2F8
100
#FCE8F3
200
#FAD1E8
300
#F8B4D9
400
#F17EB8
500
#E74694
600
#D61F69
700
#BF125D
800
#99154B
900
#751A3D




@import "tailwindcss";

@plugin "flowbite/plugin";

@source "../node_modules/flowbite";

@theme {
    /* main text color */
    --color-body: var(--color-stone-600);
    --color-body-subtle: var(--color-stone-500);

    /* text heading colors */
    --color-heading: var(--color-stone-900);

    /* used for custom brand colors */
    --color-fg-brand-subtle: var(--color-stone-200);
    --color-fg-brand: var(--color-stone-950);
    --color-fg-brand-strong: var(--color-stone-900);
}
# Tailwind CSS Buttons - Flowbite

<button type="button" class="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Default</button>
<button type="button" class="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Secondary</button>
<button type="button" class="text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary-soft shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Tertiary</button>
<button type="button" class="text-white bg-success box-border border border-transparent hover:bg-success-strong focus:ring-4 focus:ring-success-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Success</button>
<button type="button" class="text-white bg-danger box-border border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Danger</button>
<button type="button" class="text-white bg-warning box-border border border-transparent hover:bg-warning-strong focus:ring-4 focus:ring-warning-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Warning</button>
<button type="button" class="text-white bg-dark box-border border border-transparent hover:bg-dark-strong focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Dark</button>
<button type="button" class="text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Ghost</button>

# Input Sizes 

<form class="max-w-sm mx-auto space-y-4">
    <div>
        <label for="visitors" class="block mb-2.5 text-sm font-medium text-heading">Small Input</label>
        <input type="text" id="visitors" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:text-body" placeholder="" required />
    </div>
    <div>
        <label for="visitors" class="block mb-2.5 text-sm font-medium text-heading">Base Input</label>
        <input type="text" id="visitors" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="" required />
    </div>
    <div>
        <label for="visitors" class="block mb-2.5 text-sm font-medium text-heading">Large Input</label>
        <input type="text" id="visitors" class="bg-neutral-secondary-medium border border-default-medium text-heading text-base rounded-base focus:ring-brand focus:border-brand block w-full px-3.5 py-3 shadow-xs placeholder:text-body" placeholder="" required />
    </div>
    <div>
        <label for="visitors" class="block mb-2.5 text-sm font-medium text-heading">Extra Large Input</label>
        <input type="text" id="visitors" class="bg-neutral-secondary-medium border border-default-medium text-heading text-base rounded-base focus:ring-brand focus:border-brand block w-full px-4 py-3.5 shadow-xs placeholder:text-body" placeholder="" required />
    </div>
</form>
 # Navbar with dropdown

<nav class="bg-neutral-primary fixed w-full z-20 top-0 start-0 border-default">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="https://flowbite.com/docs/images/logo.svg" class="h-7" alt="Flowbite Logo" />
        <span class="self-center text-xl text-heading font-semibold whitespace-nowrap">Flowbite</span>
    </a>
    <button data-collapse-toggle="navbar-dropdown" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary" aria-controls="navbar-dropdown" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/></svg>
    </button>
    <div class="hidden w-full md:block md:w-auto" id="navbar-dropdown">
      <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-neutral-primary">
        <li>
          <a href="#" class="block py-2 px-3 text-white bg-brand rounded md:bg-transparent md:text-fg-brand md:p-0" aria-current="page">Home</a>
        </li>
        <li>
            <button id="dropdownNvbarButton" data-dropdown-toggle="dropdownNavbar" class="flex items-center justify-between w-full py-2 px-3 rounded font-medium text-heading md:w-auto hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0">
              Dropdown 
              <svg class="w-4 h-4 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/></svg>
          </button>
          <!-- Dropdown menu -->
          <div id="dropdownNavbar" class="z-10 hidden bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44">
              <ul class="p-2 text-sm text-body font-medium" aria-labelledby="dropdownNvbarButton">
                <li>
                  <a href="#" class="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Dashboard</a>
                </li>
                <li>
                  <a href="#" class="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Settings</a>
                </li>
                <li>
                  <a href="#" class="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Earnings</a>
                </li>
                <li>
                  <a href="#" class="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Sign out</a>
                </li>
              </ul>
          </div>
        </li>
        <li>
          <a href="#" class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Services</a>
        </li>
        <li>
          <a href="#" class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Pricing</a>
        </li>
        <li>
          <a href="#" class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Contact</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
# tables
Striped rows


<div class="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
    <table class="w-full text-sm text-left rtl:text-right text-body">
        <thead class="bg-neutral-secondary-soft border-b border-default">
            <tr>
                <th scope="col" class="px-6 py-3 font-medium">
                    Product name
                </th>
                <th scope="col" class="px-6 py-3 font-medium">
                    Color
                </th>
                <th scope="col" class="px-6 py-3 font-medium">
                    Category
                </th>
                <th scope="col" class="px-6 py-3 font-medium">
                    Price
                </th>
                <th scope="col" class="px-6 py-3 font-medium">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
            <tr class="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    Apple MacBook Pro 17"
                </th>
                <td class="px-6 py-4">
                    Silver
                </td>
                <td class="px-6 py-4">
                    Laptop
                </td>
                <td class="px-6 py-4">
                    $2999
                </td>
                <td class="px-6 py-4">
                    <a href="#" class="font-medium text-fg-brand hover:underline">Edit</a>
                </td>
            </tr>
            <tr class="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    Microsoft Surface Pro
                </th>
                <td class="px-6 py-4">
                    White
                </td>
                <td class="px-6 py-4">
                    Laptop PC
                </td>
                <td class="px-6 py-4">
                    $1999
                </td>
                <td class="px-6 py-4">
                    <a href="#" class="font-medium text-fg-brand hover:underline">Edit</a>
                </td>
            </tr>
            <tr class="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    Magic Mouse 2
                </th>
                <td class="px-6 py-4">
                    Black
                </td>
                <td class="px-6 py-4">
                    Accessories
                </td>
                <td class="px-6 py-4">
                    $99
                </td>
                <td class="px-6 py-4">
                    <a href="#" class="font-medium text-fg-brand hover:underline">Edit</a>
                </td>
            </tr>
            <tr class="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    Google Pixel Phone
                </th>
                <td class="px-6 py-4">
                    Gray
                </td>
                <td class="px-6 py-4">
                    Phone
                </td>
                <td class="px-6 py-4">
                    $799
                </td>
                <td class="px-6 py-4">
                    <a href="#" class="font-medium text-fg-brand hover:underline">Edit</a>
                </td>
            </tr>
            <tr class="odd:bg-neutral-primary even:bg-neutral-secondary-soft">
                <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    Apple Watch 5
                </th>
                <td class="px-6 py-4">
                    Red
                </td>
                <td class="px-6 py-4">
                    Wearables
                </td>
                <td class="px-6 py-4">
                    $999
                </td>
                <td class="px-6 py-4">
                    <a href="#" class="font-medium text-fg-brand hover:underline">Edit</a>
                </td>
            </tr>
        </tbody>
    </table>
</div>
#Striped columns


<div class="relative overflow-x-auto bg-neutral-primary shadow-xs rounded-base border border-default">
    <table class="w-full text-sm text-left rtl:text-right text-body">
        <thead class="text-sm text-body border-b border-default">
            <tr>
                <th scope="col" class="px-6 py-3 bg-neutral-secondary-soft font-medium">
                    Product name
                </th>
                <th scope="col" class="px-6 py-3 font-medium">
                    Color
                </th>
                <th scope="col" class="px-6 py-3 bg-neutral-secondary-soft font-medium">
                    Category
                </th>
                <th scope="col" class="px-6 py-3 font-medium">
                    Price
                </th>
            </tr>
        </thead>
        <tbody>
            <tr class="border-b border-default">
                <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap bg-neutral-secondary-soft">
                    Apple MacBook Pro 17"
                </th>
                <td class="px-6 py-4">
                    Silver
                </td>
                <td class="px-6 py-4 bg-neutral-secondary-soft">
                    Laptop
                </td>
                <td class="px-6 py-4">
                    $2999
                </td>
            </tr>
            <tr class="border-b border-default">
                <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap bg-neutral-secondary-soft">
                    Microsoft Surface Pro
                </th>
                <td class="px-6 py-4">
                    White
                </td>
                <td class="px-6 py-4 bg-neutral-secondary-soft">
                    Laptop PC
                </td>
                <td class="px-6 py-4">
                    $1999
                </td>
            </tr>
            <tr class="border-b border-default">
                <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap bg-neutral-secondary-soft">
                    Magic Mouse 2
                </th>
                <td class="px-6 py-4">
                    Black
                </td>
                <td class="px-6 py-4 bg-neutral-secondary-soft">
                    Accessories
                </td>
                <td class="px-6 py-4">
                    $99
                </td>
            </tr>
            <tr class="border-b border-default">
                <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap bg-neutral-secondary-soft">
                    Google Pixel Phone
                </th>
                <td class="px-6 py-4">
                    Gray
                </td>
                <td class="px-6 py-4 bg-neutral-secondary-soft">
                    Phone
                </td>
                <td class="px-6 py-4">
                    $799
                </td>
            </tr>
            <tr>
                <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap bg-neutral-secondary-soft">
                    Apple Watch 5
                </th>
                <td class="px-6 py-4">
                    Red
                </td>
                <td class="px-6 py-4 bg-neutral-secondary-soft">
                    Wearables
                </td>
                <td class="px-6 py-4">
                    $999
                </td>
            </tr>
        </tbody>
    </table>
</div>
#Hover state 


<div class="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
    <table class="w-full text-sm text-left rtl:text-right text-body">
        <thead class="text-sm text-body bg-neutral-secondary-medium border-b border-default-medium">
            <tr>
                <th scope="col" class="px-6 py-3 font-medium">
                    Product name
                </th>
                <th scope="col" class="px-6 py-3 font-medium">
                    Color
                </th>
                <th scope="col" class="px-6 py-3 font-medium">
                    Category
                </th>
                <th scope="col" class="px-6 py-3 font-medium">
                    Price
                </th>
                <th scope="col" class="px-6 py-3 font-medium">
                    <span class="sr-only">Edit</span>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr class="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium">
                <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    Apple MacBook Pro 17"
                </th>
                <td class="px-6 py-4">
                    Silver
                </td>
                <td class="px-6 py-4">
                    Laptop
                </td>
                <td class="px-6 py-4">
                    $2999
                </td>
                <td class="px-6 py-4 text-right">
                    <a href="#" class="font-medium text-fg-brand hover:underline">Edit</a>
                </td>
            </tr>
            <tr class="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium">
                <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    Microsoft Surface Pro
                </th>
                <td class="px-6 py-4">
                    White
                </td>
                <td class="px-6 py-4">
                    Laptop PC
                </td>
                <td class="px-6 py-4">
                    $1999
                </td>
                <td class="px-6 py-4 text-right">
                    <a href="#" class="font-medium text-fg-brand hover:underline">Edit</a>
                </td>
            </tr>
            <tr class="bg-neutral-primary-soft hover:bg-neutral-secondary-medium">
                <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    Magic Mouse 2
                </th>
                <td class="px-6 py-4">
                    Black
                </td>
                <td class="px-6 py-4">
                    Accessories
                </td>
                <td class="px-6 py-4">
                    $99
                </td>
                <td class="px-6 py-4 text-right">
                    <a href="#" class="font-medium text-fg-brand hover:underline">Edit</a>
                </td>
            </tr>
        </tbody>
    </table>
</div>
#Form

<form>
    <div class="grid gap-6 mb-6 md:grid-cols-2">
        <div>
            <label for="first_name" class="block mb-2.5 text-sm font-medium text-heading">First name</label>
            <input type="text" id="first_name" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="John" required />
        </div>
        <div>
            <label for="last_name" class="block mb-2.5 text-sm font-medium text-heading">Last name</label>
            <input type="text" id="last_name" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Doe" required />
        </div>
        <div>
            <label for="company" class="block mb-2.5 text-sm font-medium text-heading">Company</label>
            <input type="text" id="company" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Flowbite" required />
        </div>  
        <div>
            <label for="phone" class="block mb-2.5 text-sm font-medium text-heading">Phone number</label>
            <input type="tel" id="phone" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="123-45-678" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" required />
        </div>
        <div>
            <label for="website" class="block mb-2.5 text-sm font-medium text-heading">Website URL</label>
            <input type="url" id="website" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="flowbite.com" required />
        </div>
        <div>
            <label for="visitors" class="block mb-2.5 text-sm font-medium text-heading">Unique visitors (per month)</label>
            <input type="number" id="visitors" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="" required />
        </div>
    </div>
    <div class="mb-6">
        <label for="email" class="block mb-2.5 text-sm font-medium text-heading">Email address</label>
        <input type="email" id="email" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="john.doe@company.com" required />
    </div> 
    <div class="mb-6">
        <label for="password" class="block mb-2.5 text-sm font-medium text-heading">Password</label>
        <input type="password" id="password" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="•••••••••" required />
    </div> 
    <div class="mb-6">
        <label for="confirm_password" class="block mb-2.5 text-sm font-medium text-heading">Confirm password</label>
        <input type="password" id="confirm_password" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="•••••••••" required />
    </div> 
    <div class="flex items-start mb-6">
        <div class="flex items-center h-5">
        <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft" required />
        </div>
        <label for="remember" class="ms-2 text-sm font-medium text-heading">I agree with the <a href="#" class="text-fg-brand hover:underline">terms and conditions</a>.</label>
    </div>
    <button type="submit" class="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Submit</button>
</form>
# Checkbox example

<div class="flex items-center mb-4">
    <input id="default-checkbox" type="checkbox" value="" class="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft">
    <label for="default-checkbox" class="select-none ms-2 text-sm font-medium text-heading">Default checkbox</label>
</div>
<div class="flex items-center">
    <input checked id="checked-checkbox" type="checkbox" value="" class="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft">
    <label for="checked-checkbox" class="select-none ms-2 text-sm font-medium text-heading">Checked state</label>
</div>
# Bordered

<div class="flex items-center ps-4 bg-neutral-primary-soft border border-default rounded-base shadow-xs">
    <input id="bordered-checkbox-1" type="checkbox" value="" name="bordered-checkbox" class="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft">
    <label for="bordered-checkbox-1" class="select-none w-full py-4 ms-2 text-sm font-medium text-heading">Default checkbox</label>
</div>
<div class="flex items-center ps-4 bg-neutral-primary-soft border border-default rounded-base shadow-xs">
    <input checked id="bordered-checkbox-2" type="checkbox" value="" name="bordered-checkbox" class="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft">
    <label for="bordered-checkbox-2" class="select-none w-full py-4 ms-2 text-sm font-medium text-heading">Checked state</label>
</div>
# Bordered with icon

<div class="flex justify-between space-x-2.5 bg-neutral-primary-soft border border-default rounded-base shadow-xs">
    <label for="bordered-checkbox-5" class="p-4">
        <svg class="w-7 h-7 text-body mb-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1M5 12h14M5 12a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1m-2 3h.01M14 15h.01M17 9h.01M14 9h.01"/></svg>
        <p  class="select-none w-full text-sm font-medium text-heading">16GB unified memory</p>
        <p id="helper-checkbox-bordered-3" class="select-none text-sm text-body">Seamlessly handle multitasking, large apps.</p>
    </label>
    <input id="bordered-checkbox-5" type="checkbox" value="" name="bordered-checkbox" class="w-4 h-4 mt-4 me-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft" checked>
</div>
<div class="flex justify-between space-x-2.5 bg-neutral-primary-soft border border-default rounded-base shadow-xs">
    <label for="bordered-checkbox-6" class="p-4">
        <svg class="w-7 h-7 text-body mb-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 6c0 1.657-3.134 3-7 3S5 7.657 5 6m14 0c0-1.657-3.134-3-7-3S5 4.343 5 6m14 0v6M5 6v6m0 0c0 1.657 3.134 3 7 3s7-1.343 7-3M5 12v6c0 1.657 3.134 3 7 3s7-1.343 7-3v-6"/></svg>
        <p  class="select-none w-full text-sm font-medium text-heading">1TB SSD storage</p>
        <p id="helper-checkbox-bordered-4" class="select-none text-sm text-body">Get ultra-fast storage with 1TB of SSD space</p>
    </label>
    <input id="bordered-checkbox-6" type="checkbox" value="" name="bordered-checkbox" class="w-4 h-4 mt-4 me-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft">
</div>
# Horizontal list group

<h3 class="mb-4 font-semibold text-heading">Identification</h3>
<ul class="items-center select-none w-full text-sm font-medium text-heading bg-neutral-primary-soft border border-default rounded-base sm:flex">
    <li class="w-full border-b border-default sm:border-b-0 sm:border-r">
        <div class="flex items-center ps-3">
            <input id="vue-checkbox-list" type="checkbox" value="" class="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft">
            <label for="vue-checkbox-list" class="w-full py-3 ms-2 text-sm font-medium text-heading">Vue JS</label>
        </div>
    </li>
    <li class="w-full border-b border-default sm:border-b-0 sm:border-r">
        <div class="flex items-center ps-3">
            <input id="react-checkbox-list" type="checkbox" value="" class="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft">
            <label for="react-checkbox-list" class="w-full py-3 ms-2 text-sm font-medium text-heading">React</label>
        </div>
    </li>
    <li class="w-full border-b border-default sm:border-b-0 sm:border-r">
        <div class="flex items-center ps-3">
            <input id="angular-checkbox-list" type="checkbox" value="" class="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft">
            <label for="angular-checkbox-list" class="w-full py-3 ms-2 text-sm font-medium text-heading">Angular</label>
        </div>
    </li>
    <li class="w-full">
        <div class="flex items-center ps-3">
            <input id="laravel-checkbox-list" type="checkbox" value="" class="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft">
            <label for="laravel-checkbox-list" class="w-full py-3 ms-2 text-sm font-medium text-heading">Laravel</label>
        </div>
    </li>
</ul>
#Colors

<div class="flex items-center me-4">
    <input checked id="red-checkbox" type="checkbox" value="" class="w-4 h-4 text-red-600 bg-neutral-secondary-medium border-default-medium rounded-xs focus:ring-red-500 dark:focus:ring-red-600 ring-offset-neutral-primary focus:ring-2">
    <label for="red-checkbox" class="select-none ms-2 text-sm font-medium text-heading">Red</label>
</div>
<div class="flex items-center me-4">
    <input checked id="green-checkbox" type="checkbox" value="" class="w-4 h-4 text-green-600 bg-neutral-secondary-medium border-default-medium rounded-xs focus:ring-green-500 dark:focus:ring-green-600 ring-offset-neutral-primary focus:ring-2">
    <label for="green-checkbox" class="select-none ms-2 text-sm font-medium text-heading">Green</label>
</div>
<div class="flex items-center me-4">
    <input checked id="purple-checkbox" type="checkbox" value="" class="w-4 h-4 text-purple-600 bg-neutral-secondary-medium border-default-medium rounded-xs focus:ring-purple-500 dark:focus:ring-purple-600 ring-offset-neutral-primary focus:ring-2">
    <label for="purple-checkbox" class="select-none ms-2 text-sm font-medium text-heading">Purple</label>
</div>
<div class="flex items-center me-4">
    <input checked id="teal-checkbox" type="checkbox" value="" class="w-4 h-4 text-teal-600 bg-neutral-secondary-medium border-default-medium rounded-xs focus:ring-teal-500 dark:focus:ring-teal-600 ring-offset-neutral-primary focus:ring-2">
    <label for="teal-checkbox" class="select-none ms-2 text-sm font-medium text-heading">Teal</label>
</div>
<div class="flex items-center me-4">
    <input checked id="yellow-checkbox" type="checkbox" value="" class="w-4 h-4 text-yellow-400 bg-neutral-secondary-medium border-default-medium rounded-xs focus:ring-yellow-500 dark:focus:ring-yellow-600 ring-offset-neutral-primary focus:ring-2">
    <label for="yellow-checkbox" class="select-none ms-2 text-sm font-medium text-heading">Yellow</label>
</div>
<div class="flex items-center me-4">
    <input checked id="orange-checkbox" type="checkbox" value="" class="w-4 h-4 text-orange-500 bg-neutral-secondary-medium border-default-medium rounded-xs focus:ring-orange-500 dark:focus:ring-orange-600 ring-offset-neutral-primary focus:ring-2">
    <label for="orange-checkbox" class="select-none ms-2 text-sm font-medium text-heading">Orange</label>
</div>
