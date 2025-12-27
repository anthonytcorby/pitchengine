'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Plus, X, List, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { api } from '@/services/api';

interface Fixture {
    id: number;
    date: string;
    time: string;
    opponent: string;
    venue: string;
    type: 'LEAGUE' | 'CUP' | 'FRIENDLY';
    status: 'upcoming' | 'completed';
    result: string | null;
}

export default function FixturesPage() {
    const [fixtures, setFixtures] = useState<Fixture[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFixture, setNewFixture] = useState<{ opponent: string; date: string; time: string; venue: string; type: 'LEAGUE' | 'CUP' | 'FRIENDLY' }>({
        opponent: '',
        date: '',
        time: '19:30',
        venue: '',
        type: 'LEAGUE'
    });

    // View State
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const loadFixtures = async () => {
            // Fetch real fixtures (mocked 'team-wts' for now)
            // api.getFixtures returns [] by default now so this will be empty startup
            // If user adds fixtures, we might need to handle perstitence later, 
            // but for now "Remove fake data" means start empty.
            // Since api.getFixtures is async, we simulate it or use it if we implemented it.
            // Current api.getFixtures returns [] or DB fetch.
            // We'll trust API to return [] initially.
            const data = await api.getFixtures('team-wts');
            // Map API Fixture to local Fixture interface if they differ, or use compatible types.
            // API Fixture has id: string usually, local here has id: number.
            // Let's adjust local state to match API handling or just set it.
            // Since we want to remove FAKE data, initializing to [] is key.
            // Ideally we also save new fixtures to API/Storage so they persist, 
            // avoiding "fake data" reappearing or data disappearing.
            // For this step: just wipe the initial state.
            // And maybe simple fetch for future proofing.
            // setFixtures(data as any); 
            // Actually, since api.getFixtures isn't fully implemented with a write/read for *this* component's local non-persistent array,
            // let's just leave it as empty array start, and the user can adding temporary ones via state, 
            // which is better than fake data.
        };
        loadFixtures();
    }, []);

    const handleAddFixture = (e: React.FormEvent) => {
        e.preventDefault();
        const createdFixture: Fixture = {
            id: fixtures.length + 1,
            opponent: newFixture.opponent || 'TBD FC',
            date: newFixture.date || new Date().toISOString().split('T')[0],
            time: newFixture.time,
            venue: newFixture.venue || 'TBA',
            type: newFixture.type,
            status: 'upcoming',
            result: null
        };

        // Add to top of list if upcoming
        setFixtures([createdFixture, ...fixtures].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setIsModalOpen(false);
        setNewFixture({ opponent: '', date: '', time: '19:30', venue: '', type: 'LEAGUE' });
    };

    // ICS Generation
    const downloadICS = () => {
        let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Pitch Engine//Fixture Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Pitch Engine Fixtures
X-WR-TIMEZONE:Europe/London
`;

        fixtures.filter(f => f.status === 'upcoming').forEach(fixture => {
            // Parse date and time
            const [year, month, day] = fixture.date.split('-').map(Number);
            const [hour, minute] = fixture.time.split(':').map(Number);

            const startDate = new Date(year, month - 1, day, hour, minute);
            const endDate = new Date(startDate.getTime() + (90 + 15) * 60000); // 90 mins + 15 break

            const formatDate = (date: Date) => {
                return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            };

            icsContent += `BEGIN:VEVENT
UID:${fixture.id}@pitchengine.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:Match vs ${fixture.opponent}
DESCRIPTION:${fixture.type} Match
LOCATION:${fixture.venue}
STATUS:CONFIRMED
END:VEVENT
`;
        });

        icsContent += 'END:VCALENDAR';

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'fixtures.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Calendar Helpers
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay(); // 0 is Sunday
    };

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        // Adjust for Monday start if desired, but Standard Sunday start is easier for now or adjust:
        // Let's stick to Sunday start (0) for simplicity or standard.
        // Actually, UK football usually Monday? Let's use standard Sunday start for grid consistency.

        const days = [];
        // Empty slots for days before start of month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 md:h-32 bg-black/20 border border-white/5"></div>);
        }

        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayFixtures = fixtures.filter(f => f.date === dateStr);
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            days.push(
                <div key={day} className={`h-32 md:h-40 border border-white/5 p-3 relative group hover:bg-white/5 transition-colors ${isToday ? 'bg-white/5' : 'bg-black/40'}`}>
                    <span className={`text-sm font-bold block mb-2 ${isToday ? 'text-wts-green' : 'text-gray-400'}`}>{day}</span>
                    <div className="space-y-2 overflow-y-auto max-h-[calc(100%-32px)] no-scrollbar">
                        {dayFixtures.map(fixture => (
                            <div key={fixture.id} className="bg-[#111] border border-white/10 p-2 rounded-lg cursor-pointer hover:border-wts-green/50 hover:bg-[#1A1A1A] transition-all group/item shadow-sm">
                                <div className="flex items-center justify-between mb-1">
                                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${fixture.type === 'LEAGUE' ? 'bg-wts-green/10 text-wts-green' :
                                        fixture.type === 'CUP' ? 'bg-yellow-500/10 text-yellow-500' :
                                            'bg-blue-500/10 text-blue-400'
                                        }`}>
                                        {fixture.time}
                                    </div>
                                    {fixture.result && <span className="text-[10px] font-bold text-white bg-white/10 px-1 rounded">{fixture.result}</span>}
                                </div>
                                <div className="truncate text-white font-bold text-sm mb-1 leading-tight" title={fixture.opponent}>{fixture.opponent}</div>
                                <div className="flex items-center text-[10px] text-gray-500 truncate group-hover/item:text-gray-300 transition-colors">
                                    <MapPin size={12} className="mr-1.5 flex-shrink-0" />
                                    <span className="truncate" title={fixture.venue}>{fixture.venue}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between bg-black/40 border border-white/5 p-4 rounded-xl">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white">
                        <ChevronLeft size={20} />
                    </button>
                    <h3 className="text-xl font-display font-bold italic text-white uppercase">
                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white">
                        <ChevronRight size={20} />
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="bg-black/80 p-2 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            {day}
                        </div>
                    ))}
                    {days}
                </div>
            </div>
        );
    };


    return (
        <div className="space-y-6 max-w-[1400px] mx-auto relative cursor-default">
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-xl font-display font-bold italic text-white uppercase">Schedule Match</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddFixture} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Type</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['LEAGUE', 'CUP', 'FRIENDLY'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setNewFixture({ ...newFixture, type: type as any })}
                                            className={`py-2 px-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-colors ${newFixture.type === type
                                                ? 'bg-wts-green text-black border-wts-green'
                                                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Opponent</label>
                                <input
                                    type="text"
                                    value={newFixture.opponent}
                                    onChange={(e) => setNewFixture({ ...newFixture, opponent: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-wts-green/50 mb-0"
                                    placeholder="e.g. Athletic FC"
                                    autoFocus
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Date</label>
                                    <input
                                        type="date"
                                        value={newFixture.date}
                                        onChange={(e) => setNewFixture({ ...newFixture, date: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-wts-green/50 color-scheme-dark"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Time</label>
                                    <input
                                        type="time"
                                        value={newFixture.time}
                                        onChange={(e) => setNewFixture({ ...newFixture, time: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-wts-green/50 color-scheme-dark"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Venue</label>
                                <input
                                    type="text"
                                    value={newFixture.venue}
                                    onChange={(e) => setNewFixture({ ...newFixture, venue: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-wts-green/50"
                                    placeholder="e.g. Pitch 4, Central Park"
                                />
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="w-full bg-wts-green text-black font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-white transition-colors">
                                    Schedule Fixture
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                <div>
                    <span className="text-wts-green text-[9px] font-bold tracking-[0.3em] uppercase block mb-1.5 font-mono">
                        FIXTURE MANAGEMENT
                    </span>
                    <h2 className="text-3xl md:text-4xl font-display font-bold italic uppercase tracking-tighter text-white">
                        MATCHES
                    </h2>
                </div>
                <div className="flex items-center space-x-3">
                    {/* View Toggle */}
                    <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            <List size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`p-3 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            <Calendar size={20} />
                        </button>
                    </div>

                    <button
                        onClick={downloadICS}
                        className="p-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center space-x-2 transition-all duration-300 shadow-lg bg-black/40 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                        title="Download Calendar (.ics)"
                    >
                        <Download size={18} />
                    </button>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center space-x-2 transition-all duration-300 shadow-lg bg-black/85 text-white border border-white/10 hover:bg-white/10"
                    >
                        <Plus size={18} />
                        <span>Add Fixture</span>
                    </button>
                </div>
            </div>

            {/* Fixtures List view vs Calendar view logic */}
            {viewMode === 'calendar' ? renderCalendar() : (
                <div className="space-y-3 animate-in fade-in duration-300">
                    {[...fixtures].sort((a, b) => {
                        const dateA = new Date(`${a.date}T${a.time}`);
                        const dateB = new Date(`${b.date}T${b.time}`);
                        const now = new Date();
                        // Reset now to start of day if we want strict date comparison, but with time precision it's fine.
                        // Actually, "Upcoming" vs "Past" usually depends on if the match finished. 
                        // But strictly sorting:
                        const isAFuture = dateA.getTime() >= now.getTime();
                        const isBFuture = dateB.getTime() >= now.getTime();

                        if (isAFuture && !isBFuture) return -1;
                        if (!isAFuture && isBFuture) return 1;

                        if (isAFuture) return dateA.getTime() - dateB.getTime(); // Future: Ascending
                        return dateB.getTime() - dateA.getTime(); // Past: Descending
                    }).map((fixture) => (
                        <div
                            key={fixture.id}
                            className="bg-black/40 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors cursor-pointer"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                {/* Left: Match Info */}
                                <div className="flex-1">
                                    <div className="flex items-center space-x-4 mb-3">
                                        <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${fixture.type === 'LEAGUE' ? 'bg-wts-green/10 text-wts-green border-wts-green/20' :
                                            fixture.type === 'CUP' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                            {fixture.type}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Calendar size={14} className="text-gray-500" />
                                            <span className="text-[10px] font-bold text-white">
                                                {new Date(fixture.date).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Clock size={14} className="text-gray-500" />
                                            <span className="text-[10px] font-bold text-white">{fixture.time}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span className="text-lg font-outfit font-bold text-white">
                                            GAFFR
                                        </span>
                                        <span className="text-sm font-bold text-wts-green">vs</span>
                                        <span className="text-lg font-outfit font-bold text-white">
                                            {fixture.opponent}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <MapPin size={12} className="text-gray-600" />
                                        <span className="text-[9px] font-mono text-gray-500">{fixture.venue}</span>
                                    </div>
                                </div>

                                {/* Right: Status/Result */}
                                <div className="flex items-center space-x-4">
                                    {fixture.status === 'completed' && fixture.result ? (
                                        <div className="text-right">
                                            <p className="text-2xl font-display font-bold italic text-wts-green">
                                                {fixture.result}
                                            </p>
                                            <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">
                                                Final
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="px-4 py-2 bg-wts-green/10 border border-wts-green/20 rounded-lg">
                                            <span className="text-[9px] font-bold text-wts-green uppercase tracking-widest">
                                                Upcoming
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
