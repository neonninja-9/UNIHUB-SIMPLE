
import React from 'react';
import { IDCard } from './components/IDCard';
import { Student } from './types';
import { PrintIcon } from './components/icons';

const placeholderStudent: Student = {
  universityName: 'UNIVERSITY NAME',
  universityCampus: 'CAMPUS LOCATION',
  studentPhotoUrl: `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiByb2xlPSJpbWciIGFyaWEtbGFiZWw9IlBsYWNlaG9sZGVyOiBTdHVkZW50IFBob3RvIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBzbGljZSIgZm9jdXNhYmxlPSJmYWxzZSI+PHRpdGxlPlBsYWNlaG9sZGVyPC90aXRsZT48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjODY4ZTk2Ij48L3JlY3Q+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiNkZWUyZTYiIGR5PSIuM2VtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TdHVkZW50IFBob3RvPC90ZXh0Pjwvc3ZnPg==`,
  studentName: 'STUDENT NAME',
  degree: 'DEGREE',
  branch: 'BRANCH',
  session: 'YYYY-YYYY',
  issuingAuthoritySignatureUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMzUiPjxwYXRoIGQ9Ik0xIDMzYzQgLTQgOCAtMiAxMyAtNGM1IC0yIDEwIC01IDE1IC02YzUgLTEgMTEgLTIgMTYgMGM1IDIgOSAzIDE0IDVjNSAyIDEwIDMgMTUgM2M1IDAgOSAtMyAxNCAtNWMzIC0xIDQgLTIgNiAtMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+',
  holderSignatureUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMzUiPjxwYXRoIGQ9Ik0xIDMxYzIgLTYgNSAtMTEgMTIgLTEzYzcgLTIgMTQgMiAxOSA1YzUgMyAxMSA1IDE3IDRjNiAtMSA5IC02IDE1IC03czEyIDIgMTcgN2M1IDUgMTAgNyAxNSA2YzUgLTEgOCAtNSAxMCAtMTIiIGZpbGw9Im5vbmUiIHN0b2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+',
  enrollmentNo: 'XXXXXXXXXXXX',
  dob: 'DD.MM.YYYY',
  bloodGroup: 'X+ve',
  emergencyContact: {
    family: 'XXXXXXXXXX',
    institution: 'XXXXXXXXXX',
  },
  validity: 'DD.MM.YYYY',
  idCardNo: 'XXXXXXXX',
  lostAndFoundContact: 'XXXXXXXXXX',
};


const App: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-gray-800 dark:text-gray-200">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">Student ID Card Portal</h1>
        <p className="mt-2 text-md sm:text-lg text-gray-600 dark:text-gray-400">
          A generic, reusable ID card component. Click the card to flip it.
        </p>
      </div>

      <div id="printable-area">
        <IDCard student={placeholderStudent} />
      </div>

      <button
        onClick={handlePrint}
        className="mt-8 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors duration-200"
        aria-label="Print ID Card"
      >
        <PrintIcon className="w-5 h-5" />
        Print ID Card
      </button>

      <footer className="mt-12 text-center text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} University Portals Inc. All rights reserved.</p>
        <p className="text-sm mt-1">This is a template demonstration.</p>
      </footer>
    </div>
  );
};

export default App;