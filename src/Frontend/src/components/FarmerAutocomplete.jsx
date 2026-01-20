import React, { useState, useEffect, useRef } from 'react';
import { filterFarmers } from '../services/farmerService';
import { Loader2, Search, User } from 'lucide-react';

/**
 * Componente de autocomplete para buscar agricultores por nome ou CPF
 * @param {function} onSelect - Callback quando um agricultor é selecionado
 * @param {object} value - Agricultor atualmente selecionado { id, name, cpf }
 * @param {string} placeholder - Placeholder do input
 */
const FarmerAutocomplete = ({ onSelect, value, placeholder = "Digite nome ou CPF..." }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [error, setError] = useState(null);
    const containerRef = useRef(null);
    const debounceRef = useRef(null);

    // Formatar CPF para exibição
    const formatCpf = (cpf) => {
        if (!cpf) return '';
        const cleaned = cpf.replace(/\D/g, '');
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    // Máscara de CPF para o input
    const maskCpf = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    // Buscar agricultores na API
    const searchFarmers = async (searchQuery) => {
        if (!searchQuery || searchQuery.length < 2) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Remove caracteres especiais para detectar se é CPF
            const cleanedQuery = searchQuery.replace(/\D/g, '');
            const hasOnlyNumbers = /^\d+$/.test(searchQuery.replace(/[\.\-\s]/g, ''));

            console.log('🔍 Buscando:', searchQuery);
            console.log('🔍 Limpo:', cleanedQuery);
            console.log('🔍 É número?', hasOnlyNumbers);

            let allResults = [];

            if (hasOnlyNumbers && cleanedQuery.length > 0) {
                // Busca por CPF - buscar todos e filtrar localmente
                console.log('🔍 Buscando todos para filtrar por CPF...');
                const response = await filterFarmers({});
                console.log('🔍 Resposta da API:', response);

                if (response && response.farmers) {
                    console.log('🔍 Total de agricultores:', response.farmers.length);
                    // Filtrar localmente por CPF parcial
                    // IMPORTANTE: Limpar os caracteres especiais do CPF da API antes de comparar
                    allResults = response.farmers.filter(f => {
                        if (!f.cpf) return false;
                        const farmerCpfClean = f.cpf.replace(/\D/g, ''); // Remove pontos e traços
                        const cpfMatch = farmerCpfClean.includes(cleanedQuery);
                        if (cpfMatch) console.log('✅ Match:', f.name, f.cpf, '->', farmerCpfClean);
                        return cpfMatch;
                    });
                    console.log('🔍 Resultados filtrados:', allResults.length);
                }
            } else {
                // Busca por nome
                console.log('🔍 Buscando por nome:', searchQuery);
                const response = await filterFarmers({ name: searchQuery });
                console.log('🔍 Resposta da API:', response);

                if (response && response.farmers) {
                    allResults = response.farmers;
                }
            }

            setResults(allResults.slice(0, 10));
            setShowDropdown(true);
        } catch (err) {
            console.error('❌ Erro ao buscar agricultores:', err);
            setError('Erro ao buscar agricultores');
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounce na busca
    const handleInputChange = (e) => {
        let newQuery = e.target.value;

        // Verificar se o usuário está digitando apenas números (possivelmente CPF)
        const cleanedValue = newQuery.replace(/[\D]/g, '');
        const isTypingCpf = cleanedValue.length > 0 && /^[\d\.\-\s]*$/.test(newQuery);

        // Aplicar máscara de CPF se estiver digitando apenas números
        if (isTypingCpf && cleanedValue.length <= 11) {
            newQuery = maskCpf(newQuery);
        }

        setQuery(newQuery);

        // Limpar seleção se o usuário começar a digitar novamente
        if (value) {
            onSelect(null);
        }

        // Cancelar busca anterior
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // Nova busca com debounce
        debounceRef.current = setTimeout(() => {
            searchFarmers(newQuery);
        }, 300);
    };

    // Selecionar agricultor
    const handleSelect = (farmer) => {
        const selected = {
            id: farmer.id,
            name: farmer.name,
            cpf: farmer.cpf
        };
        onSelect(selected);
        setQuery(farmer.name);
        setShowDropdown(false);
        setResults([]);
    };

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Atualizar query quando value mudar externamente
    useEffect(() => {
        if (value && value.name) {
            setQuery(value.name);
        } else if (!value) {
            setQuery('');
        }
    }, [value]);

    // Cleanup debounce
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    return (
        <div className="farmer-autocomplete" ref={containerRef}>
            <div className="autocomplete-input-container">
                <Search size={18} className="autocomplete-icon" />
                <input
                    type="text"
                    className="form-input autocomplete-input"
                    placeholder={placeholder}
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => results.length > 0 && setShowDropdown(true)}
                />
                {isLoading && <Loader2 size={18} className="autocomplete-loader" />}
            </div>

            {showDropdown && (
                <div className="autocomplete-dropdown">
                    {error ? (
                        <div className="autocomplete-error">{error}</div>
                    ) : results.length > 0 ? (
                        results.map((farmer) => (
                            <div
                                key={farmer.id}
                                className="autocomplete-item"
                                onClick={() => handleSelect(farmer)}
                            >
                                <User size={16} className="autocomplete-item-icon" />
                                <div className="autocomplete-item-content">
                                    <span className="autocomplete-item-name">{farmer.name}</span>
                                    <span className="autocomplete-item-cpf">{formatCpf(farmer.cpf)}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="autocomplete-empty">
                            Nenhum agricultor encontrado
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FarmerAutocomplete;
