import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronRight, Home, Plus } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  variant?: 'default' | 'flush' | 'bordered' | 'no-arrow';
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, onToggle, variant = 'default' }) => {
  const isFlush = variant === 'flush';
  const isBordered = variant === 'bordered';
  const noArrow = variant === 'no-arrow';

  return (
    <div className={`
      ${isBordered ? 'border border-gray-200 rounded-xl mb-3 overflow-hidden' : ''}
      ${!isFlush && !isBordered ? 'border border-gray-200 mb-[-1px] first:rounded-t-xl last:rounded-b-xl overflow-hidden' : ''}
      ${isFlush ? 'border-b border-gray-200 last:border-0' : ''}
    `}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-5 py-4 text-left transition-all
          ${isOpen ? 'bg-blue-50/50' : 'bg-white hover:bg-gray-50'}
          ${isOpen && !isFlush ? 'text-blue-600' : 'text-gray-700'}
        `}
      >
        <span className="text-sm font-semibold">{title}</span>
        {!noArrow && (
          <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown size={18} className={isOpen ? 'text-blue-600' : 'text-gray-400'} />
          </div>
        )}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-5 py-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function AccordionView() {
  const [defaultOpen, setDefaultOpen] = useState<number | null>(0);
  const [flushOpen, setFlushOpen] = useState<number | null>(0);
  const [borderedOpen, setBorderedOpen] = useState<number | null>(0);
  const [noArrowOpen, setNoArrowOpen] = useState<number | null>(0);
  const [alwaysOpen, setAlwaysOpen] = useState<number[]>([0]);

  const toggleAlwaysOpen = (index: number) => {
    if (alwaysOpen.includes(index)) {
      setAlwaysOpen(alwaysOpen.filter(i => i !== index));
    } else {
      setAlwaysOpen([...alwaysOpen, index]);
    }
  };

  const accordionContent = (
    <>
      <p className="mb-2">
        <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element.
      </p>
      <p>
        These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code className="text-pink-500 bg-pink-50 px-1 rounded">.accordion-body</code>, though the transition does limit overflow.
      </p>
    </>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Accordions</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Home size={14} />
          <span>Home</span>
          <ChevronRight size={14} />
          <span>Base UI</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Accordion</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Default Accordion */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Default Accordion</h2>
          </div>
          <div className="p-6">
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {[1, 2, 3].map((i, idx) => (
                <AccordionItem
                  key={idx}
                  title={`Accordion Item #${i}`}
                  isOpen={defaultOpen === idx}
                  onToggle={() => setDefaultOpen(defaultOpen === idx ? null : idx)}
                >
                  {accordionContent}
                </AccordionItem>
              ))}
            </div>
          </div>
        </div>

        {/* Flush Accordions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Flush Accordions</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">
              Add <code className="text-pink-500 bg-pink-50 px-1 rounded">.accordion-flush</code> to remove the default <code className="text-pink-500 bg-pink-50 px-1 rounded">background-color</code>, some borders, and some rounded corners to render accordions edge-to-edge with their parent container.
            </p>
            <div className="border-t border-gray-200">
              {[1, 2, 3].map((i, idx) => (
                <AccordionItem
                  key={idx}
                  variant="flush"
                  title={`Accordion Item #${i}`}
                  isOpen={flushOpen === idx}
                  onToggle={() => setFlushOpen(flushOpen === idx ? null : idx)}
                >
                  Placeholder content for this accordion, which is intended to demonstrate the <code className="text-pink-500 bg-pink-50 px-1 rounded">.accordion-flush</code> class. This is the first item's accordion body.
                </AccordionItem>
              ))}
            </div>
          </div>
        </div>

        {/* Bordered Accordions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Bordered Accordions</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">
              Using the card component, you can extend the default collapse behavior to create an accordion. To properly achieve the accordion style, be sure to use <code className="text-pink-500 bg-pink-50 px-1 rounded">.accordion</code> as a wrapper.
            </p>
            <div>
              {[1, 2, 3].map((i, idx) => (
                <AccordionItem
                  key={idx}
                  variant="bordered"
                  title={`Accordion Item #${i}`}
                  isOpen={borderedOpen === idx}
                  onToggle={() => setBorderedOpen(borderedOpen === idx ? null : idx)}
                >
                  {accordionContent}
                </AccordionItem>
              ))}
            </div>
          </div>
        </div>

        {/* Accordion Without Arrow */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Accordion Without Arrow</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">
              Using the card component, you can extend the default collapse behavior to create an accordion. To properly achieve the accordion style, be sure to use <code className="text-pink-500 bg-pink-50 px-1 rounded">.accordion</code> as a wrapper.
            </p>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {[1, 2, 3].map((i, idx) => (
                <AccordionItem
                  key={idx}
                  variant="no-arrow"
                  title={`Accordion Item #${i}`}
                  isOpen={noArrowOpen === idx}
                  onToggle={() => setNoArrowOpen(noArrowOpen === idx ? null : idx)}
                >
                  {accordionContent}
                </AccordionItem>
              ))}
            </div>
          </div>
        </div>

        {/* External Options: Always Open */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Always Open (Multiple)</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">
              Omit the data-bs-parent attribute on each <code className="text-pink-500 bg-pink-50 px-1 rounded">.accordion-collapse</code> to make accordion items stay open when another item is opened.
            </p>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {[1, 2, 3].map((i, idx) => (
                <AccordionItem
                  key={idx}
                  title={`Always Open Item #${i}`}
                  isOpen={alwaysOpen.includes(idx)}
                  onToggle={() => toggleAlwaysOpen(idx)}
                >
                  This item stays open even when you open other items. This is useful for dashboards where users might want to compare information across multiple sections simultaneously.
                </AccordionItem>
              ))}
            </div>
          </div>
        </div>

        {/* External Options: Custom Icons */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Custom Icons Accordion</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">
              You can easily customize the toggle icons by using different Lucide icons or SVG elements.
            </p>
            <div className="space-y-3">
              {[
                { title: 'System Settings', icon: <ChevronRight size={18} /> },
                { title: 'User Permissions', icon: <Plus size={18} /> },
                { title: 'Advanced Configuration', icon: <ChevronDown size={18} /> }
              ].map((item, idx) => {
                const [isOpen, setIsOpen] = useState(idx === 0);
                return (
                  <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className={`w-full flex items-center justify-between px-5 py-4 text-left transition-all ${isOpen ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      <span className="text-sm font-semibold">{item.title}</span>
                      <div className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
                        {item.icon}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-5 py-4 text-sm text-gray-500 bg-white border-t border-gray-100">
                        Custom styled accordion with primary color background and custom rotation logic for the icons.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
