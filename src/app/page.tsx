'use client';

import NavBar from "@/components/NavBar";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';


export default function Home() {
    const router = useRouter();

    return (
        <div>
            <NavBar />
            <div className="max-w rounded overflow-hidden shadow-lg">

                <div className="px-6 py-4 border-solid border-2">
                    <div className="font-bold text-xl mb-2">NextJS heading</div>
                    <p className="text-gray-700 text-base">
                        NextJS content
                    </p>
                    <div className="px-6 pt-4 pb-2">
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#AskHN</span>
                    </div>
                </div>


                <div className="px-6 py-4 border-solid border-2">
                    <div className="font-bold text-xl mb-2">NextJS heading</div>
                    <p className="text-gray-700 text-base">
                        NextJS content
                    </p>

                    <div className="px-6 pt-4 pb-2">
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#AskHN</span>
                    </div>

                </div>
            </div>

        </div >
    );

}