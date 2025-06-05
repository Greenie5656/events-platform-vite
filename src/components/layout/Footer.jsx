import { Calendar } from "lucide-react";

function Footer() {
    return (
        <footer className="bg-gunmetal text-snow border-t border-payne-gray mt-auto">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                        <Calendar className="h-5 w-5 text-asparagus" />
                        <span className="font-semibold">Eventra</span>
                        <span className="text-xs bg-asparagus text-gunmetal px-2 py-1 rounded-full font-medium">Beta</span>
                    </div>
                </div>
                <p className="text-payne-gray text-sm text-center sm:text-left">© {new Date().getFullYear()} Events Platform. All rights reserved.</p>
            
            </div>
        </footer>
    );
}

export default Footer;