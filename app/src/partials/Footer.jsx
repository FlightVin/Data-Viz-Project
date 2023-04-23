import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Footer() {
  const iconWidth = "30";
  const iconHeight = "30";
  const location=useLocation();
  const isLandingPage=()=>{
    return location.pathname === '/';
  }

  return (
    <footer className="fixed bottom-0 bg-slate-50 w-full mt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-8 flex flex-row justify-center">         
        {/* Bottom area */}
        <div className="flex items-center justify-center p-0">
          <div className="text-sm text-gray-600 text-center">Team Anything. 
            {isLandingPage() && 
              <span> Based on template by <a className="text-blue-600 hover:underline" href="https://cruip.com/">Cruip</a>.</span>
            }
            </div>
          {/* Not gonna remove this cause GNU GPL */}
        </div>
      </div>
         
    </footer>
  );
}

export default Footer;