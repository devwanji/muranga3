import React from 'react';
import { Link } from 'wouter';
import {
  FacebookIcon,
  AlternateEmailIcon,
  SmartphoneIcon,
  LocationOnIcon,
  PhoneAndroidIcon,
  EmailIcon
} from '../assets/icons/CategoryIcons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 font-heading">Murang'a Marketplace</h3>
            <p className="mb-4">Connecting businesses and customers in Murang'a County.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-gray-300">
                <FacebookIcon />
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <AlternateEmailIcon />
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <SmartphoneIcon />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 font-heading">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-300 hover:text-white">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/businesses">
                  <a className="text-gray-300 hover:text-white">Businesses</a>
                </Link>
              </li>
              <li>
                <Link href="/service-request">
                  <a className="text-gray-300 hover:text-white">Services</a>
                </Link>
              </li>
              <li>
                <Link href="/register-business">
                  <a className="text-gray-300 hover:text-white">Register</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 font-heading">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/businesses?category=retail">
                  <a className="text-gray-300 hover:text-white">Retail Shops</a>
                </Link>
              </li>
              <li>
                <Link href="/businesses?category=restaurant">
                  <a className="text-gray-300 hover:text-white">Restaurants</a>
                </Link>
              </li>
              <li>
                <Link href="/businesses?category=farm">
                  <a className="text-gray-300 hover:text-white">Farm Produce</a>
                </Link>
              </li>
              <li>
                <Link href="/businesses?category=handyman">
                  <a className="text-gray-300 hover:text-white">Handyman Services</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 font-heading">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <LocationOnIcon className="mr-2" />
                <span>Murang'a Town, Kenya</span>
              </li>
              <li className="flex items-center">
                <PhoneAndroidIcon className="mr-2" />
                <span>+254 712 345 678</span>
              </li>
              <li className="flex items-center">
                <EmailIcon className="mr-2" />
                <span>info@murangamarket.co.ke</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Murang'a Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
