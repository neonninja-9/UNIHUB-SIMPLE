# Student Portal Dashboard Refactor & Enhancement TODO

## 1. Page Routing Setup
- [ ] Create `/attendance/page.tsx` for detailed attendance page
- [ ] Create `/courses/page.tsx` for all enrolled courses display
- [ ] Create `/digilocker/page.tsx` for DigiLocker integration
- [ ] Modify `/dashboard/page.tsx` to be overview only (greeting, summary cards, quick links)

## 2. Component Refactoring
- [ ] Update `WelcomeCard` to be compact "Welcome back" card
- [ ] Ensure consistent card design across all components with `shadow-md hover:shadow-lg`
- [ ] Update `CourseList` to use grid layout (3-4 cards per row, responsive)
- [ ] Move DigiLocker from widget to separate page
- [ ] Update sidebar to navigate between pages using Next.js Link

## 3. Styling & Theme Updates
- [ ] Update `globals.css` to remove visible scrollbars and add smooth scrolling
- [ ] Update `tailwind.config.js` to include Inter/Poppins fonts and custom theme colors
- [ ] Change primary accent to `#3B82F6` (blue-500)
- [ ] Update background to `bg-gray-50`, text to `text-gray-700`
- [ ] Apply `rounded-2xl` consistently
- [ ] Add hover effects and transitions

## 4. Layout Improvements
- [ ] Balance white space, reduce large gaps
- [ ] Align resource and notification panels neatly on right side
- [ ] Ensure responsive design

## 5. Testing & Verification
- [ ] Test navigation between pages
- [ ] Verify responsive design
- [ ] Check hover effects and transitions
- [ ] Ensure DigiLocker page functions correctly
